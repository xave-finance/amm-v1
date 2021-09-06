// Contains a bunch of partial functions to help with scaffolding

import { ethers } from "hardhat";
import { TOKENS } from "./Constants";

import { ERC20, Curve, CurveFactory } from "../typechain";
import { BigNumberish, Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { mintCADC, mintEURS, mintUSDC, mintXSGD } from "./Utils";

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

  const CadcToUsdAssimilator = await ethers.getContractFactory("CadcToUsdAssimilator");
  const UsdcToUsdAssimilator = await ethers.getContractFactory("UsdcToUsdAssimilator");
  const EursToUsdAssimilator = await ethers.getContractFactory("EursToUsdAssimilator");
  const XsgdToUsdAssimilator = await ethers.getContractFactory("XsgdToUsdAssimilator");

  const cadcToUsdAssimilator = await CadcToUsdAssimilator.deploy();
  const usdcToUsdAssimilator = await UsdcToUsdAssimilator.deploy();
  const eursToUsdAssimilator = await EursToUsdAssimilator.deploy();
  const xsgdToUsdAssimilator = await XsgdToUsdAssimilator.deploy();

  const usdc = (await ethers.getContractAt("ERC20", TOKENS.USDC.address)) as ERC20;
  const cadc = (await ethers.getContractAt("ERC20", TOKENS.CADC.address)) as ERC20;
  const eurs = (await ethers.getContractAt("ERC20", TOKENS.EURS.address)) as ERC20;
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
    cadcToUsdAssimilator,
    usdcToUsdAssimilator,
    eursToUsdAssimilator,
    xsgdToUsdAssimilator,
    usdc,
    cadc,
    eurs,
    xsgd,
    erc20,
    CurveFactory,
    RouterFactory,
    curvesLib,
    orchestratorLib,
    proportionalLiquidityLib,
    swapsLib,
    viewLiquidityLib
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
    yesWhitelisting,
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
    yesWhitelisting?: boolean;
  }): Promise<{ oq_curve: Curve; curveLpToken: ERC20 }> {
    await curveFactory.oq_newCurve(name, symbol, base, quote, baseWeight, quoteWeight, baseAssimilator, quoteAssimilator);

    // Get oq_curve address
    const curveAddress = await curveFactory.oq_curves(
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "address"], [base, quote])),
    );
    const curveLpToken = (await ethers.getContractAt("ERC20", curveAddress)) as ERC20;
    const oq_curve = (await ethers.getContractAt("Curve", curveAddress)) as Curve;

    if (!yesWhitelisting) {
      await oq_curve.turnOffWhitelisting();
    }

    // Set params for the oq_curve
    if (params) {
      await oq_curve.oq_setParams(...params);
    } else {
      await oq_curve.oq_setParams(ALPHA, BETA, MAX, EPSILON, LAMBDA);
    }

    return {
      oq_curve,
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
    yesWhitelisting,
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
    yesWhitelisting?: boolean;
  }) {
    const { oq_curve, curveLpToken } = await createCurve({
      name,
      symbol,
      base,
      quote,
      baseWeight,
      quoteWeight,
      baseAssimilator,
      quoteAssimilator,
      yesWhitelisting,
    });

    const tx = await oq_curve.oq_setParams(...params);
    await tx.wait();

    return {
      oq_curve,
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
