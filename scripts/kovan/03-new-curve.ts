require("dotenv").config();
import { ethers } from "hardhat";

import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { BigNumberish, Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";

const NAME = "HALO AMM V1";
const SYMBOL = "HALO-AMM-V1";

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

// Core Contract Addresses
const CONTRACT_CORE_CURVE_FACTORY_ADDR = process.env.CONTRACT_CORE_CURVE_FACTORY_ADDR;

// Assimilator Contract Addresses
const CONTRACT_ASSIMILATOR_AUDTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_AUDTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_CHFTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_CHFTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_GBPTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_GBPTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_JPYTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_JPYTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_KRWTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_KRWTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_PKRTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_PKRTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR;

let TOKEN_AUD = process.env.TOKENS_KOVAN_AUD_ADDR;
let TOKEN_CHF = process.env.TOKENS_KOVAN_CHF_ADDR;
let TOKEN_EURS = process.env.TOKENS_KOVAN_EURS_ADDR;
let TOKEN_GBP = process.env.TOKENS_KOVAN_GBP_ADDR;
let TOKEN_JPY = process.env.TOKENS_KOVAN_JPY_ADDR;
let TOKEN_KRW = process.env.TOKENS_KOVAN_KRW_ADDR;
let TOKEN_PKR = process.env.TOKENS_KOVAN_PKR_ADDR;
let TOKEN_USDC = process.env.TOKENS_KOVAN_USDC_ADDR;

async function main() {
  const [deployer, user1] = await ethers.getSigners();

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await deployer.getAddress()}`);
  console.log(`Deployer balance: ${await deployer.getBalance()}`);
  console.log(`User1 account: ${await user1.getAddress()}`);
  console.log(`User1 balance: ${await user1.getBalance()}`);

  const curveFactory = (await ethers.getContractAt("CurveFactory", CONTRACT_CORE_CURVE_FACTORY_ADDR)) as Curve;
  const aud = (await ethers.getContractAt("ERC20", TOKEN_AUD)) as ERC20;
  const chf = (await ethers.getContractAt("ERC20", TOKEN_CHF)) as ERC20;
  const eurs = (await ethers.getContractAt("ERC20", TOKEN_EURS)) as ERC20;
  const gbp = (await ethers.getContractAt("ERC20", TOKEN_GBP)) as ERC20;
  const jpy = (await ethers.getContractAt("ERC20", TOKEN_JPY)) as ERC20;
  const krw = (await ethers.getContractAt("ERC20", TOKEN_KRW)) as ERC20;
  const pkr = (await ethers.getContractAt("ERC20", TOKEN_PKR)) as ERC20;
  const usdc = (await ethers.getContractAt("ERC20", TOKEN_USDC)) as ERC20;

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
    const tx = await curveFactory.newCurve(
      name,
      symbol,
      base,
      quote,
      baseWeight,
      quoteWeight,
      baseAssimilator,
      quoteAssimilator,
      {
        gasLimit: 12000000,
      },
    );
    await tx.wait();

    console.log('CurveFactory#newCurve TX Hash: ', tx.hash)

    // Get curve address
    const curveAddress = await curveFactory.curves(
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "address"], [base, quote])),
    );
    const curveLpToken = (await ethers.getContractAt("ERC20", curveAddress)) as ERC20;
    const curve = (await ethers.getContractAt("Curve", curveAddress)) as Curve;

    console.log(`curveAddress ${symbol}: `, curveAddress)
    console.log(`Curve ${symbol} Address: `, curve.address)
    console.log(`Curve LP Token ${symbol} Address:`, curveLpToken.address)

    const turnOffWhitelisting = await curve.turnOffWhitelisting();
    console.log('Curve#turnOffWhitelisting TX Hash: ', turnOffWhitelisting.hash)

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
    // Set parameters/dimensions here
    // const tx = await curve.setParams(...params, { gasLimit: 12000000 });
    // console.log('Curve#setParams TX Hash: ', tx.hash)
    // await tx.wait();
    return {
      curve,
      curveLpToken,
    };
  };

  const { curve: curveAUD } = await createCurveAndSetParams({
    name: 'Australian Dollar',
    symbol: 'AUD',
    base: aud.address,
    quote: usdc.address,
    baseWeight: parseUnits("0.5"),
    quoteWeight: parseUnits("0.5"),
    baseAssimilator: CONTRACT_ASSIMILATOR_AUDTOUSD_ADDR,
    quoteAssimilator: CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR,
    params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
  });

  const { curve: curveCHF } = await createCurveAndSetParams({
    name: 'Swiss Franc',
    symbol: 'CHF',
    base: chf.address,
    quote: usdc.address,
    baseWeight: parseUnits("0.5"),
    quoteWeight: parseUnits("0.5"),
    baseAssimilator: CONTRACT_ASSIMILATOR_CHFTOUSD_ADDR,
    quoteAssimilator: CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR,
    params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
  });

  const { curve: curveEURS } = await createCurveAndSetParams({
    name: 'Euro',
    symbol: 'EURS',
    base: eurs.address,
    quote: usdc.address,
    baseWeight: parseUnits("0.5"),
    quoteWeight: parseUnits("0.5"),
    baseAssimilator: CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR,
    quoteAssimilator: CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR,
    params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
  });

  const { curve: curveGBP } = await createCurveAndSetParams({
    name: 'Pound Sterling',
    symbol: 'GBP',
    base: gbp.address,
    quote: usdc.address,
    baseWeight: parseUnits("0.5"),
    quoteWeight: parseUnits("0.5"),
    baseAssimilator: CONTRACT_ASSIMILATOR_GBPTOUSD_ADDR,
    quoteAssimilator: CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR,
    params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
  });

  const { curve: curveJPY } = await createCurveAndSetParams({
    name: 'Japanese Yen',
    symbol: 'JPY',
    base: jpy.address,
    quote: usdc.address,
    baseWeight: parseUnits("0.5"),
    quoteWeight: parseUnits("0.5"),
    baseAssimilator: CONTRACT_ASSIMILATOR_JPYTOUSD_ADDR,
    quoteAssimilator: CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR,
    params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
  });

  const { curve: curveKRW } = await createCurveAndSetParams({
    name: 'South Korean Won',
    symbol: 'KRW',
    base: krw.address,
    quote: usdc.address,
    baseWeight: parseUnits("0.5"),
    quoteWeight: parseUnits("0.5"),
    baseAssimilator: CONTRACT_ASSIMILATOR_KRWTOUSD_ADDR,
    quoteAssimilator: CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR,
    params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
  });

  const { curve: curvePKR } = await createCurveAndSetParams({
    name: 'Pakistani Rupee',
    symbol: 'PKR',
    base: pkr.address,
    quote: usdc.address,
    baseWeight: parseUnits("0.5"),
    quoteWeight: parseUnits("0.5"),
    baseAssimilator: CONTRACT_ASSIMILATOR_PKRTOUSD_ADDR,
    quoteAssimilator: CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR,
    params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
  });

  console.log(`curveAUD.address: `, curveAUD.address);
  console.log(`curveCHF.address: `, curveCHF.address);
  console.log(`curveEURS.address`, curveEURS.address);
  console.log(`curveGBP.address: `, curveGBP.address);
  console.log(`curveJPY.address: `, curveJPY.address);
  console.log(`curveKRW.address: `, curveKRW.address);
  console.log(`curvePKR.address: `, curvePKR.address);

  console.log(`Deployer balance: ${await deployer.getBalance()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
