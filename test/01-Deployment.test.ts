/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from "hardhat";
import { Signer, Contract, ContractFactory, BigNumber, BigNumberish } from "ethers";
import chai, { expect } from "chai";
import chaiBigNumber from "chai-bignumber";

import { CurveFactory } from "../typechain/CurveFactory";
import { Curve } from "../typechain/Curve";
import { ERC20 } from "../typechain/ERC20";
import { Router } from "../typechain/Router";

import { scaffoldTest, scaffoldHelpers } from "./Setup";
import { assert } from "console";

import { TOKENS } from "./Constants";

chai.use(chaiBigNumber(BigNumber));

const { parseUnits } = ethers.utils;

const DIMENSION = {
  alpha: parseUnits(process.env.DIMENSION_ALPHA),
  beta: parseUnits(process.env.DIMENSION_BETA),
  max: parseUnits(process.env.DIMENSION_MAX),
  epsilon: parseUnits(process.env.DIMENSION_EPSILON),
  lambda: parseUnits(process.env.DIMENSION_LAMBDA)
}

describe("Deployment", () => {
  let [user1, user2]: Signer[] = [];
  let [user1Address, user2Address]: string[] = [];

  let cadcToUsdAssimilator: Contract;
  let usdcToUsdAssimilator: Contract;
  let eursToUsdAssimilator: Contract;
  let xsgdToUsdAssimilator: Contract;

  let CurveFactory: ContractFactory;
  let RouterFactory: ContractFactory;

  let curveFactory: CurveFactory;
  let router: Router;

  let curveFactoryContract: Contract;
  let routerContract: Contract;

  let usdc: ERC20;
  let cadc: ERC20;
  let erc20: ERC20;

  let curvesLib: Contract;
  let orchestratorLib: Contract;
  let proportionalLiquidityLib: Contract;
  let swapsLib: Contract;
  let viewLiquidityLib: Contract;

  let createCurveAndSetParams: ({
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
  }) => Promise<{
    curve: Curve;
    curveLpToken: ERC20;
  }>;

  beforeEach(async function () {
    ({
      users: [user1, user2],
      userAddresses: [user1Address, user2Address],
      cadcToUsdAssimilator,
      usdcToUsdAssimilator,
      eursToUsdAssimilator,
      xsgdToUsdAssimilator,
      CurveFactory,
      RouterFactory,
      usdc,
      cadc,
      erc20,
      curvesLib,
      orchestratorLib,
      proportionalLiquidityLib,
      swapsLib,
      viewLiquidityLib
    } = await scaffoldTest());

    curveFactoryContract = await CurveFactory.deploy();
    routerContract = await RouterFactory.deploy(curveFactoryContract.address);

    curveFactory = (await CurveFactory.deploy()) as CurveFactory;
    router = (await RouterFactory.deploy(curveFactory.address)) as Router;

    ({ createCurveAndSetParams } = await scaffoldHelpers({
      curveFactory,
      erc20,
    }));
  });

  describe("Core Contracts", async () => {
    it("Curves", () => { assert(ethers.utils.isAddress(curvesLib.address)); })
    it("Orchestrator", () => { assert(ethers.utils.isAddress(orchestratorLib.address)); })
    it("ProportionalLiquidity", () => { assert(ethers.utils.isAddress(proportionalLiquidityLib.address)); })
    it("Swaps", () => { assert(ethers.utils.isAddress(swapsLib.address)); })
    it("ViewLiquidity", () => { assert(ethers.utils.isAddress(viewLiquidityLib.address)); })
    it("CurveFactory", () => { assert(ethers.utils.isAddress(curveFactoryContract.address)); })
    it("Router", () => { assert(ethers.utils.isAddress(routerContract.address)); })
  });

  describe("Assimilators", async () => {
    it("CadcToUsdAssimilator", () => { assert(ethers.utils.isAddress(cadcToUsdAssimilator.address)); })
    it("UsdcToUsdAssimilator", () => { assert(ethers.utils.isAddress(usdcToUsdAssimilator.address)); })
    it("EursToUsdAssimilator", () => { assert(ethers.utils.isAddress(eursToUsdAssimilator.address)); })
    it("XsgdToUsdAssimilator", () => { assert(ethers.utils.isAddress(xsgdToUsdAssimilator.address)); })
  })

  describe("Curve/Pair Contract", async () => {
    const NAME = "CAD Coin";
    const SYMBOL = "CADC";

    it("CADC:USDC", async () => {
      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.CADC.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: cadcToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      assert(ethers.utils.isAddress(curve.address));
      assert(ethers.utils.isAddress(await curveFactoryContract.getCurve(TOKENS.CADC.address, TOKENS.USDC.address)));
    })
  })
});