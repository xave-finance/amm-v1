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

  let cadcToUsdAssimilator: Contract;
  let usdcToUsdAssimilator: Contract;
  let eursToUsdAssimilator: Contract;
  let xsgdToUsdAssimilator: Contract;
  let tcadToUsdAssimilator: Contract;
  let taudToUsdAssimilator: Contract;
  let tgbpToUsdAssimilator: Contract;
  let fxphpToUsdAssimilator: Contract;
  let tagphpToUsdAssimilator: Contract;

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

      usdcToUsdAssimilator,
      xsgdToUsdAssimilator,
      tcadToUsdAssimilator,
      taudToUsdAssimilator,
      tgbpToUsdAssimilator,
      fxphpToUsdAssimilator,
      tagphpToUsdAssimilator,

      // cadcToUsdAssimilator,
      // eursToUsdAssimilator

      CurveFactory,
      RouterFactory,
      usdc,
      // cadc,
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
    it.only("Curves", () => { assert(ethers.utils.isAddress(curvesLib.address)); })
    it.only("Orchestrator", () => { assert(ethers.utils.isAddress(orchestratorLib.address)); })
    it.only("ProportionalLiquidity", () => { assert(ethers.utils.isAddress(proportionalLiquidityLib.address)); })
    it.only("Swaps", () => { assert(ethers.utils.isAddress(swapsLib.address)); })
    it.only("ViewLiquidity", () => { assert(ethers.utils.isAddress(viewLiquidityLib.address)); })
    it.only("CurveFactory", () => { assert(ethers.utils.isAddress(curveFactoryContract.address)); })
    it.only("Router", () => { assert(ethers.utils.isAddress(routerContract.address)); })
  });

  describe("Assimilators", async () => {
    it.only("XsgdToUsdAssimilator", () => { assert(ethers.utils.isAddress(xsgdToUsdAssimilator.address)); })
    it.only("TcadToUsdAssimilator", () => { assert(ethers.utils.isAddress(tcadToUsdAssimilator.address)); })
    it.only("TaudToUsdAssimilator", () => { assert(ethers.utils.isAddress(taudToUsdAssimilator.address)); })
    it.only("TgbpToUsdAssimilator", () => { assert(ethers.utils.isAddress(tgbpToUsdAssimilator.address)); })
    it.only("FxphpToUsdAssimilator", () => { assert(ethers.utils.isAddress(fxphpToUsdAssimilator.address)); })
    it.only("TagphpToUsdAssimilator", () => { assert(ethers.utils.isAddress(tagphpToUsdAssimilator.address)); })
  })

  describe("Curve/Pair Contract", async () => {
    it.only("XSGD:USDC", async () => {
      const NAME = "XSGD";
      const SYMBOL = "XSGD";

      const quoteAssimilatorAddr = require(path.resolve(__dirname, `../scripts/config/usdcassimilator/${process.env.NETWORK}.json`)).address;

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.XSGD.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: quoteAssimilatorAddr,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.XSGD.address, TOKENS.USDC.address);

      expect(ethers.utils.isAddress(curveAddrA)).true;
      expect(ethers.utils.isAddress(curveAddrB)).true;
      expect(curveAddrA).to.be.equal(curveAddrB);
    })

    it.only("TCAD:USDC", async () => {
      const NAME = "TCAD";
      const SYMBOL = "TCAD";

      const quoteAssimilatorAddr = require(path.resolve(__dirname, `../scripts/config/usdcassimilator/${process.env.NETWORK}.json`)).address;

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.TCAD.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: quoteAssimilatorAddr,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.TCAD.address, TOKENS.USDC.address);

      expect(ethers.utils.isAddress(curveAddrA)).true;
      expect(ethers.utils.isAddress(curveAddrB)).true;
      expect(curveAddrA).to.be.equal(curveAddrB);
    })

    it.only("TAUD:USDC", async () => {
      const NAME = "TAUD";
      const SYMBOL = "TAUD";

      const quoteAssimilatorAddr = require(path.resolve(__dirname, `../scripts/config/usdcassimilator/${process.env.NETWORK}.json`)).address;

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.TAUD.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: quoteAssimilatorAddr,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.TAUD.address, TOKENS.USDC.address);

      expect(ethers.utils.isAddress(curveAddrA)).true;
      expect(ethers.utils.isAddress(curveAddrB)).true;
      expect(curveAddrA).to.be.equal(curveAddrB);
    })

    it.only("TGBP:USDC", async () => {
      const NAME = "TGBP";
      const SYMBOL = "TGBP";

      const quoteAssimilatorAddr = require(path.resolve(__dirname, `../scripts/config/usdcassimilator/${process.env.NETWORK}.json`)).address;

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.TGBP.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: quoteAssimilatorAddr,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.TGBP.address, TOKENS.USDC.address);

      expect(ethers.utils.isAddress(curveAddrA)).true;
      expect(ethers.utils.isAddress(curveAddrB)).true;
      expect(curveAddrA).to.be.equal(curveAddrB);
    })

    it.only("FXPHP:USDC", async () => {
      const NAME = "FXPHP";
      const SYMBOL = "FXPHP";

      const quoteAssimilatorAddr = require(path.resolve(__dirname, `../scripts/config/usdcassimilator/${process.env.NETWORK}.json`)).address;

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.FXPHP.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: quoteAssimilatorAddr,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.FXPHP.address, TOKENS.USDC.address);

      expect(ethers.utils.isAddress(curveAddrA)).true;
      expect(ethers.utils.isAddress(curveAddrB)).true;
      expect(curveAddrA).to.be.equal(curveAddrB);
    })

    it.only("TAGPHP:USDC", async () => {
      const NAME = "TAGPHP";
      const SYMBOL = "TAGPHP";

      const quoteAssimilatorAddr = require(path.resolve(__dirname, `../scripts/config/usdcassimilator/${process.env.NETWORK}.json`)).address;

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.TAGPHP.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: quoteAssimilatorAddr,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.TAGPHP.address, TOKENS.USDC.address);

      expect(ethers.utils.isAddress(curveAddrA)).true;
      expect(ethers.utils.isAddress(curveAddrB)).true;
      expect(curveAddrA).to.be.equal(curveAddrB);
    })
  })
});