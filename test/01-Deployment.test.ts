/* eslint-disable @typescript-eslint/no-unused-vars */
import path from "path";
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
import { CONFIG } from "./Config";
const { TOKENS } = require(path.resolve(__dirname, `tokens/${process.env.NETWORK}/Constants.ts`));

chai.use(chaiBigNumber(BigNumber));

const { parseUnits } = ethers.utils;

const DIMENSION = {
  alpha: parseUnits(CONFIG.DIMENSION_ALPHA),
  beta: parseUnits(CONFIG.DIMENSION_BETA),
  max: parseUnits(CONFIG.DIMENSION_MAX),
  epsilon: parseUnits(CONFIG.DIMENSION_EPSILON),
  lambda: parseUnits(CONFIG.DIMENSION_LAMBDA)
}

describe("Deployment", () => {
  let [user1, user2]: Signer[] = [];
  let [user1Address, user2Address]: string[] = [];
  let assimilator = {};
  let quoteAssimilatorAddr;

  let usdcToUsdAssimilator: Contract;
  let eursToUsdAssimilator: Contract;
  let xsgdToUsdAssimilator: Contract;
  let cadcToUsdAssimilator: Contract;
  let fxphpToUsdAssimilator: Contract;

  let CurveFactory: ContractFactory;
  let RouterFactory: ContractFactory;

  let curveFactory: CurveFactory;
  let router: Router;

  let curveFactoryContract: Contract;
  let routerContract: Contract;

  let usdc: ERC20;
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

      usdcToUsdAssimilator,
      eursToUsdAssimilator,
      xsgdToUsdAssimilator,
      cadcToUsdAssimilator,
      fxphpToUsdAssimilator,

      CurveFactory,
      RouterFactory,
      usdc,
      erc20,
      curvesLib,
      orchestratorLib,
      proportionalLiquidityLib,
      swapsLib,
      viewLiquidityLib
    } = await scaffoldTest());

    assimilator = {
      'EURS': eursToUsdAssimilator,
      'XSGD': xsgdToUsdAssimilator,
      'CADC': cadcToUsdAssimilator,
      'FXPHP': fxphpToUsdAssimilator
    };

    curveFactoryContract = await CurveFactory.deploy();
    routerContract = await RouterFactory.deploy(curveFactoryContract.address);

    curveFactory = (await CurveFactory.deploy()) as CurveFactory;
    router = (await RouterFactory.deploy(curveFactory.address)) as Router;

    ({ createCurveAndSetParams } = await scaffoldHelpers({
      curveFactory,
      erc20,
    }));

    quoteAssimilatorAddr = require(path.resolve(__dirname, `../scripts/config/usdcassimilator/${process.env.NETWORK}.json`));
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
    it("EursToUsdAssimilator", () => { assert(ethers.utils.isAddress(assimilator['EURS'].address)); })
    it("XsgdToUsdAssimilator", () => { assert(ethers.utils.isAddress(assimilator['XSGD'].address)); })
    it("CadcToUsdAssimilator", () => { assert(ethers.utils.isAddress(assimilator['CADC'].address)); })
    it("FxphpToUsdAssimilator", () => { assert(ethers.utils.isAddress(assimilator['FXPHP'].address)); })
  })

  describe("Curve/Pair Contract", async () => {
    it("EURS:USDC", async () => {
      const NAME = "EURS";
      const SYMBOL = "EURS";

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.EURS.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: assimilator['EURS'].address,
        quoteAssimilator: quoteAssimilatorAddr.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.EURS.address, TOKENS.USDC.address);

      expect(ethers.utils.isAddress(curveAddrA)).true;
      expect(ethers.utils.isAddress(curveAddrB)).true;
      expect(curveAddrA).to.be.equal(curveAddrB);
    })

    it("XSGD:USDC", async () => {
      const NAME = "XSGD";
      const SYMBOL = "XSGD";

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.XSGD.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: assimilator['XSGD'].address,
        quoteAssimilator: quoteAssimilatorAddr.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.XSGD.address, TOKENS.USDC.address);

      expect(ethers.utils.isAddress(curveAddrA)).true;
      expect(ethers.utils.isAddress(curveAddrB)).true;
      expect(curveAddrA).to.be.equal(curveAddrB);
    })

    it.only("CADC:USDC", async () => {
      const NAME = "CADC";
      const SYMBOL = "CADC";

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.CADC.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: assimilator['CADC'].address,
        quoteAssimilator: quoteAssimilatorAddr.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.CADC.address, TOKENS.USDC.address);

      expect(ethers.utils.isAddress(curveAddrA)).true;
      expect(ethers.utils.isAddress(curveAddrB)).true;
      expect(curveAddrA).to.be.equal(curveAddrB);
    })

    it("FXPHP:USDC", async () => {
      const NAME = "FXPHP";
      const SYMBOL = "FXPHP";

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.FXPHP.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: assimilator['FXPHP'].address,
        quoteAssimilator: quoteAssimilatorAddr.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.FXPHP.address, TOKENS.USDC.address);

      expect(ethers.utils.isAddress(curveAddrA)).true;
      expect(ethers.utils.isAddress(curveAddrB)).true;
      expect(curveAddrA).to.be.equal(curveAddrB);
    })
  })
});