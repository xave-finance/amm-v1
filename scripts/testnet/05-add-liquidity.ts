require("dotenv").config();
import { ethers } from "hardhat";

import { TOKENS } from "../../test/Constants";
import { mintEURS, mintUSDC, getFutureTime } from "../../test/Utils";

import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { BigNumberish, Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";

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

export const getDeployer = async (): Promise<{
  deployer: Signer;
}> => {
  const [deployer] = await ethers.getSigners();
  return {
    deployer
  };
};

const CONTRACT_CURVE_FACTORY_ADDR = process.env.CONTRACT_CURVE_FACTORY_ADDR;
const CONTRACT_EURSTOUSDASSIMILATOR_ADDR = process.env.CONTRACT_EURSTOUSDASSIMILATOR_ADDR;
const CONTRACT_USDCTOUSDASSIMILATOR_ADDR = process.env.CONTRACT_USDCTOUSDASSIMILATOR_ADDR;

async function main() {
  // const curve = (await ethers.getContractAt("Curves", "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1")) as Curve;
  // console.log(curve.address)

  const { deployer } = await getDeployer();

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await deployer.getAddress()}`);
  console.log(`Deployer balance: ${await deployer.getBalance()}`);

  const curveFactory = (await ethers.getContractAt("CurveFactory", CONTRACT_CURVE_FACTORY_ADDR)) as Curve;
  const usdc = (await ethers.getContractAt("ERC20", TOKENS.USDC.address)) as ERC20;
  const eurs = (await ethers.getContractAt("ERC20", TOKENS.EURS.address)) as ERC20;
  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;

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

  const mintAndApprove = async function (
    tokenAddress: string,
    minter: Signer,
    amount: BigNumberish,
    recipient: string,
  ) {
    const minterAddress = await minter.getAddress();

    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    console.log('tokenAddress', tokenAddress)
    console.log('minter', minterAddress)
    console.log('amount', amount.toString())
    console.log('recipient', recipient)
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')

    if (tokenAddress.toLowerCase() === TOKENS.USDC.address.toLowerCase()) {
      await mintUSDC(minterAddress, amount);
    }

    if (tokenAddress.toLowerCase() === TOKENS.EURS.address.toLowerCase()) {
      await mintEURS(minterAddress, amount);
    }

    await erc20.attach(tokenAddress).connect(minter).approve(recipient, amount);
  };

  const multiMintAndApprove = async function (requests: [string, Signer, BigNumberish, string][]) {
    for (let i = 0; i < requests.length; i++) {
      await mintAndApprove(...requests[i]);
    }
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

  // Supply liquidity to the pools
  // Mint tokens and approve
  const approval = await multiMintAndApprove([
    [TOKENS.USDC.address, deployer, parseUnits("10000000", TOKENS.USDC.decimals), curveEURS.address],
    [TOKENS.EURS.address, deployer, parseUnits("10000000", TOKENS.EURS.decimals), curveEURS.address]
  ]);
  console.log('Mint Approval: ', approval)

  const depositToCurveEURS = await curveEURS
    .connect(deployer)
    .deposit(parseUnits("5000000"), await getFutureTime())
    .then(x => x.wait());

  console.log('Deposit: ', depositToCurveEURS)

  console.log(`Deployer balance: ${await deployer.getBalance()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
