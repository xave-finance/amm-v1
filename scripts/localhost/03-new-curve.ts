const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.localhost') });

import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { BigNumberish } from "ethers";
import { parseUnits } from "ethers/lib/utils";

const NAME = "STASIS EURS";
const SYMBOL = "EURS";

// Weights are always 50/50

// Pool must respect a 10/90 ratio
// i.e. value of one pair cannot exceed 90% of the pools value
const ALPHA = parseUnits(process.env.DIMENSION_ALPHA);

// Slippage (fees) will that will be introduced when one of the tokens's ratio:
// - exceeds 75% of the pool value
// - goes under 25% of the pool value
const BETA = parseUnits(process.env.DIMENSION_BETA);
const MAX = parseUnits(process.env.DIMENSION_MAX);
const EPSILON = parseUnits(process.env.DIMENSION_EPSILON); // 5 basis point
const LAMBDA = parseUnits(process.env.DIMENSION_LAMBDA);

const CONTRACT_CORE_CURVE_FACTORY_ADDR = process.env.CONTRACT_CORE_CURVE_FACTORY_ADDR;
const CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR;

const TOKEN_USDC = process.env.TOKENS_USDC_ADDR;
const TOKEN_EURS = process.env.TOKENS_EURS_ADDR;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await deployer.getAddress()}`);
  console.log(`Deployer balance: ${await deployer.getBalance()}`);

  const curveFactory = (await ethers.getContractAt("CurveFactory", CONTRACT_CORE_CURVE_FACTORY_ADDR)) as Curve;
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
    console.log('Curve Address: ', curveAddress)
    const curveLpToken = (await ethers.getContractAt("ERC20", curveAddress)) as ERC20;
    const curve = (await ethers.getContractAt("Curve", curveAddress)) as Curve;

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

  const { curve: curveEURS } = await createCurveAndSetParams({
    name: NAME,
    symbol: SYMBOL,
    base: eurs.address,
    quote: usdc.address,
    baseWeight: parseUnits("0.5"),
    quoteWeight: parseUnits("0.5"),
    baseAssimilator: CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR,
    quoteAssimilator: CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR,
    params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
  });

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
