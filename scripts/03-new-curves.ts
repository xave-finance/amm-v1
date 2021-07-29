import hre from "hardhat";
import { parseUnits } from "@ethersproject/units";
import { BigNumberish } from "ethers";
import { ERC20 } from "../typechain/ERC20";

const { ethers } = hre;

import { CurveFactory, Curve } from "../typechain";
import { CONTRACTS } from "./config/contracts";
import { deployedLogs } from "./Utils";

const CORE_ADDRESSES = {
  curveFactory: CONTRACTS.factory
}

const ASSIMILATOR_ADDRESSES = {
  usdcToUsdAssimilator: CONTRACTS.usdcToUsdAssimilator,
  eursToUsdAssimilator: CONTRACTS.eursToUsdAssimilator,
};

const DIMENSION = {
  alpha: parseUnits(process.env.DIMENSION_ALPHA),
  beta: parseUnits(process.env.DIMENSION_BETA),
  max: parseUnits(process.env.DIMENSION_MAX),
  epsilon: parseUnits(process.env.DIMENSION_EPSILON),
  lambda: parseUnits(process.env.DIMENSION_LAMBDA)
}

const TOKEN = {
  usdc: process.env.TOKEN_USDC,
  eurs: process.env.TOKEN_EURS,
  cadc: process.env.TOKEN_CADC,
  xsgd: process.env.TOKEN_XSGD
}

async function main() {
  console.time('Deployment Time');
  const curveFactory = (await ethers.getContractAt(
    "CurveFactory",
    CORE_ADDRESSES.curveFactory,
  )) as CurveFactory;

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

    const output = {
      curveAddress,
    };

    // Deployed contracts log
    await deployedLogs(hre.network.name, `curve_${symbol}_deployed`, output);

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
    const tx = await curve.setParams(...params, { gasLimit: 12000000 });
    console.log('Curve#setParams TX Hash: ', tx.hash)
    await tx.wait();
    return {
      curve,
      curveLpToken,
    };
  };

  const { curve: curveEURS } = await createCurveAndSetParams({
    name: 'EURS Statis',
    symbol: 'EURS',
    base: TOKEN.eurs,
    quote: TOKEN.usdc,
    baseWeight: parseUnits("0.5"),
    quoteWeight: parseUnits("0.5"),
    baseAssimilator: ASSIMILATOR_ADDRESSES.eursToUsdAssimilator,
    quoteAssimilator: ASSIMILATOR_ADDRESSES.usdcToUsdAssimilator,
    params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
  });

  console.timeEnd('Deployment Time');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
