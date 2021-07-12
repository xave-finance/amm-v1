require("dotenv").config();
import { ethers } from "hardhat";

import { mintCADC, mintUSDC, getFutureTime } from "../../test/Utils";

import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { BigNumberish, Signer } from "ethers";
import { parseUnits, formatUnits } from "ethers/lib/utils";

const NAME = "DFX V1";
const SYMBOL = "DFX-V1";

// Weights are always 50/50

// Pool must respect a 10/90 ratio
// i.e. value of one pair cannot exceed 90% of the pools value
const ALPHA = parseUnits("0.8");

// Slippage (fees) will that will be introduced when one of the tokens's ratio:
// - exceeds 75% of the pool value
// - goes under 25% of the pool value
const BETA = parseUnits("0.5");

const MAX = parseUnits("0.15");
const EPSILON = parseUnits("0.0005"); // 5 basis point
const LAMBDA = parseUnits("0.3");

const netObj = JSON.parse(process.env.npm_config_argv).original;
const NETWORK = netObj[netObj.length - 1];

const LOCAL_NODE = process.env.LOCAL_NODE;
const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE);

const CONTRACT_CURVE_FACTORY_ADDR = process.env.CONTRACT_CURVE_FACTORY_ADDR;
const CONTRACT_EURSTOUSDASSIMILATOR_ADDR = process.env.CONTRACT_EURSTOUSDASSIMILATOR_ADDR;
const CONTRACT_USDCTOUSDASSIMILATOR_ADDR = process.env.CONTRACT_USDCTOUSDASSIMILATOR_ADDR;

let TOKEN_USDC: string;
let TOKEN_EURS: string;
const TOKENS_EURS_DECIMALS = process.env.TOKENS_EURS_DECIMALS;

export const getDeployer = async (): Promise<{
  deployer: Signer;
  user1: Signer;
}> => {
  const [deployer, user1] = await ethers.getSigners();
  return {
    deployer,
    user1
  };
};

async function main() {
  let _deployer: any;
  let _user1: any;

  if (NETWORK === 'localhost') {
    _deployer = await provider.getSigner();
    _user1 = await provider.getSigner(1);

    TOKEN_USDC = process.env.TOKENS_USDC_MAINNET_ADDR;
    TOKEN_EURS = process.env.TOKENS_EURS_MAINNET_ADDR
  } else {
    const { deployer, user1 } = await getDeployer();
    _deployer = deployer;
    _user1 = user1;

    TOKEN_USDC = process.env.TOKENS_USDC_KOVAN_ADDR;
    TOKEN_EURS = process.env.TOKENS_EURS_KOVAN_ADDR
  }

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await _deployer.getAddress()}`);
  console.log(`Deployer balance: ${await _deployer.getBalance()}`);
  console.log(`User1 account: ${await _user1.getAddress()}`);
  console.log(`User1 balance: ${await _user1.getBalance()}`);

  const curveFactory = (await ethers.getContractAt("CurveFactory", CONTRACT_CURVE_FACTORY_ADDR)) as Curve;
  const usdc = (await ethers.getContractAt("ERC20", TOKEN_USDC)) as ERC20;
  const eurs = (await ethers.getContractAt("ERC20", TOKEN_EURS)) as ERC20;

  const createCurve = async function ({
    name,
    symbol,
    base,
    quote,
    baseWeight,
    quoteWeight,
    baseAssimilator,
    quoteAssimilator,
  }: {
    name: string;
    symbol: string;
    base: string;
    quote: string;
    baseWeight: BigNumberish;
    quoteWeight: BigNumberish;
    baseAssimilator: string;
    quoteAssimilator: string;
  }): Promise<{ curve: Curve; curveLpToken: ERC20 }> {
    const curveAddress = await curveFactory.curves(
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "address"], [base, quote])),
    );
    console.log('CurveFactory#curves Address: ', curveAddress)
    const curveLpToken = (await ethers.getContractAt("ERC20", curveAddress)) as ERC20;
    const curve = (await ethers.getContractAt("Curve", curveAddress)) as Curve;

    return {
      curve,
      curveLpToken,
    };
  };

  const createCurveAndSetParams = async function ({
    name,
    symbol,
    base,
    quote,
    baseWeight,
    quoteWeight,
    baseAssimilator,
    quoteAssimilator,
    params,
  }: {
    name: string;
    symbol: string;
    base: string;
    quote: string;
    baseWeight: BigNumberish;
    quoteWeight: BigNumberish;
    baseAssimilator: string;
    quoteAssimilator: string;
    params: [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish];
  }) {
    const { curve, curveLpToken } = await createCurve({
      name,
      symbol,
      base,
      quote,
      baseWeight,
      quoteWeight,
      baseAssimilator,
      quoteAssimilator,
    });

    return {
      curve,
      curveLpToken,
    };
  };

  const { curve: curveEURS } = await createCurveAndSetParams({
    name: NAME,
    symbol: SYMBOL,
    base: eurs.address,
    quote: usdc.address,
    baseWeight: parseUnits("0.5"),
    quoteWeight: parseUnits("0.5"),
    baseAssimilator: CONTRACT_EURSTOUSDASSIMILATOR_ADDR,
    quoteAssimilator: CONTRACT_USDCTOUSDASSIMILATOR_ADDR,
    params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
  });

  const eurAmt = 20000;
  console.log(`Swapping ${eurAmt} EUR to USDC`);

  const eursBefore = await eurs.balanceOf(await _deployer.getAddress());
  console.log("Before EURS bal", eursBefore.toString());

  await curveEURS
    .connect(_deployer)
    .originSwap(eurs.address, usdc.address, eurAmt, 0, await getFutureTime(), {
      gasLimit: 3000000,
    });

  const eursAfter = await eurs.balanceOf(await _deployer.getAddress());
  console.log("After EURS bal", eursAfter.toString());

  console.log(`Deployer balance: ${await _deployer.getBalance()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
