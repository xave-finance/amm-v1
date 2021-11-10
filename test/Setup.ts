// Contains a bunch of partial functions to help with scaffolding
import path from "path";
import { ethers } from "hardhat";
// import { TOKENS } from "./Constants";
const { TOKENS } = require(path.resolve(__dirname, `tokens/${process.env.NETWORK}/Constants.ts`));

import { ERC20, Curve, CurveFactory } from "../typechain";
import { BigNumberish, Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { mintCADC, mintEURS, mintUSDC, mintXSGD } from "./Utils";

import EURS_USDC_ASSIM from "../scripts/halo/assimilatorConfigs/localhost/EURS_USDC.json";
import CADC_USDC_ASSIM from "../scripts/halo/assimilatorConfigs/localhost/CADC_USDC.json";

const XSGD_USDC_ASSIM = require(`../scripts/halo/assimilatorConfigs/${process.env.NETWORK}/XSGD_USDC.json`);

export const ALPHA = parseUnits("0.5");
export const BETA = parseUnits("0.35");
export const MAX = parseUnits("0.15");
export const EPSILON = parseUnits("0.0004");
export const LAMBDA = parseUnits("0.3");

// eslint-disable-next-line
export const scaffoldTest = async () => {
  const users = await ethers.getSigners();
  const userAddresses: string[] = await Promise.all(users.map(x => x.getAddress()));

  const CurvesLib = await ethers.getContractFactory("Curves");
  const OrchestratorLib = await ethers.getContractFactory("Orchestrator");
  const ProportionalLiquidityLib = await ethers.getContractFactory("ProportionalLiquidity");
  const SwapsLib = await ethers.getContractFactory("Swaps");
  const ViewLiquidityLib = await ethers.getContractFactory("ViewLiquidity");

  const curvesLib = await CurvesLib.deploy();
  const orchestratorLib = await OrchestratorLib.deploy();
  const proportionalLiquidityLib = await ProportionalLiquidityLib.deploy();
  const swapsLib = await SwapsLib.deploy();
  const viewLiquidityLib = await ViewLiquidityLib.deploy();

  const UsdcToUsdAssimilator = await ethers.getContractFactory("UsdcToUsdAssimilator");

  const usdcToUsdAssimilator = await UsdcToUsdAssimilator.deploy();

  const BaseToUsdAssimilator = await ethers.getContractFactory("BaseToUsdAssimilator");
  // const cadcToUsdAssimilator = await BaseToUsdAssimilator.deploy(
  //   parseUnits("1", CADC_USDC_ASSIM.baseDecimals),
  //   CADC_USDC_ASSIM.baseTokenAddress,
  //   CADC_USDC_ASSIM.quoteTokenAddress,
  //   CADC_USDC_ASSIM.oracleAddress,
  // );
  // const eursToUsdAssimilator = await BaseToUsdAssimilator.deploy(
  //   parseUnits("1", EURS_USDC_ASSIM.baseDecimals),
  //   EURS_USDC_ASSIM.baseTokenAddress,
  //   EURS_USDC_ASSIM.quoteTokenAddress,
  //   EURS_USDC_ASSIM.oracleAddress,
  // );

  const xsgdToUsdAssimilator = await BaseToUsdAssimilator.deploy(
    parseUnits("1", XSGD_USDC_ASSIM.baseDecimals),
    XSGD_USDC_ASSIM.baseTokenAddress,
    XSGD_USDC_ASSIM.quoteTokenAddress,
    XSGD_USDC_ASSIM.oracleAddress,
  );

  const usdc = (await ethers.getContractAt("ERC20", TOKENS.USDC.address)) as ERC20;
  // const cadc = (await ethers.getContractAt("ERC20", TOKENS.CADC.address)) as ERC20;
  // const eurs = (await ethers.getContractAt("ERC20", TOKENS.EURS.address)) as ERC20;
  const xsgd = (await ethers.getContractAt("ERC20", TOKENS.XSGD.address)) as ERC20;

  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;

  const CurveFactory = await ethers.getContractFactory("CurveFactory", {
    libraries: {
      Curves: curvesLib.address,
      Orchestrator: orchestratorLib.address,
      ProportionalLiquidity: proportionalLiquidityLib.address,
      Swaps: swapsLib.address,
      ViewLiquidity: viewLiquidityLib.address,
    },
  });

  const RouterFactory = await ethers.getContractFactory("Router");

  return {
    users,
    userAddresses,
    usdcToUsdAssimilator,
    xsgdToUsdAssimilator,

    // cadcToUsdAssimilator,
    // eursToUsdAssimilator,

    usdc,
    // cadc,
    // eurs,
    xsgd,
    erc20,
    CurveFactory,
    RouterFactory,
    curvesLib,
    orchestratorLib,
    proportionalLiquidityLib,
    swapsLib,
    viewLiquidityLib,
  };
};

// eslint-disable-next-line
export const scaffoldHelpers = async ({ curveFactory, erc20 }: { curveFactory: CurveFactory; erc20: ERC20 }) => {
  const createCurve = async function ({
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
    params?: [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish];
  }): Promise<{ curve: Curve; curveLpToken: ERC20 }> {
    await curveFactory.newCurve(name, symbol, base, quote, baseWeight, quoteWeight, baseAssimilator, quoteAssimilator);

    // Get curve address
    const curveAddress = await curveFactory.curves(
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "address"], [base, quote])),
    );
    const curveLpToken = (await ethers.getContractAt("ERC20", curveAddress)) as ERC20;
    const curve = (await ethers.getContractAt("Curve", curveAddress)) as Curve;

    // Set params for the curve
    if (params) {
      await curve.setParams(...params);
    } else {
      await curve.setParams(ALPHA, BETA, MAX, EPSILON, LAMBDA);
    }

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
    params
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
      quoteAssimilator
    });

    const tx = await curve.setParams(...params);
    await tx.wait();

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

    if (tokenAddress.toLowerCase() === TOKENS.USDC.address.toLowerCase()) {
      await mintUSDC(minterAddress, amount);
    }

    if (tokenAddress.toLowerCase() === TOKENS.CADC.address.toLowerCase()) {
      await mintCADC(minterAddress, amount);
    }

    if (tokenAddress.toLowerCase() === TOKENS.EURS.address.toLowerCase()) {
      await mintEURS(minterAddress, amount);
    }

    if (tokenAddress.toLowerCase() === TOKENS.XSGD.address.toLowerCase()) {
      await mintXSGD(minterAddress, amount);
    }

    await erc20.attach(tokenAddress).connect(minter).approve(recipient, amount);
  };

  const multiMintAndApprove = async function (requests: [string, Signer, BigNumberish, string][]) {
    for (let i = 0; i < requests.length; i++) {
      await mintAndApprove(...requests[i]);
    }
  };

  return { createCurveAndSetParams, createCurve, mintAndApprove, multiMintAndApprove };
};