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

chai.use(chaiBigNumber(BigNumber));

const { parseUnits } = ethers.utils;

const { ORACLES, TOKENS } = require(path.resolve(__dirname, `tokens/${process.env.NETWORK}/Constants.ts`));

import { CONFIG } from "./Config";
const DIMENSION = {
  alpha: parseUnits(CONFIG.DIMENSION_ALPHA),
  beta: parseUnits(CONFIG.DIMENSION_BETA),
  max: parseUnits(CONFIG.DIMENSION_MAX),
  epsilon: parseUnits(CONFIG.DIMENSION_EPSILON),
  lambda: parseUnits(CONFIG.DIMENSION_LAMBDA)
}

describe("Factory", function () {
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

  let usdc: ERC20;
  let eurs: ERC20;
  let xsgd: ERC20;
  let cadc: ERC20;
  let fxphp: ERC20;
  let erc20: ERC20;

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

  before(async function () {
    ({
      users: [user1, user2],
      userAddresses: [user1Address, user2Address],

      usdcToUsdAssimilator,
      eursToUsdAssimilator,
      xsgdToUsdAssimilator,
      cadcToUsdAssimilator,
      fxphpToUsdAssimilator,

      usdc,
      eurs,
      xsgd,
      fxphp,
      erc20,

      CurveFactory,
      RouterFactory,
    } = await scaffoldTest());

    assimilator = {
      'EURS': eursToUsdAssimilator,
      'XSGD': xsgdToUsdAssimilator,
      'CADC': cadcToUsdAssimilator,
      'FXPHP': fxphpToUsdAssimilator,
    };

    const mainnetUsdcAssimilator = require(path.resolve(__dirname, `../scripts/config/usdcassimilator/${process.env.NETWORK}.json`));
    quoteAssimilatorAddr = process.env.NETWORK === 'mainnet' ? mainnetUsdcAssimilator : usdcToUsdAssimilator;
  });

  beforeEach(async function () {
    curveFactory = (await CurveFactory.deploy()) as CurveFactory;
    router = (await RouterFactory.deploy(curveFactory.address)) as Router;

    ({ createCurveAndSetParams } = await scaffoldHelpers({
      curveFactory,
      erc20,
    }));
  });

  it("EURS:USDC - No duplicate pairs", async function () {
    const NAME = "EURS";
    const SYMBOL = "EURS";
    const { curve } = await createCurveAndSetParams({
      name: NAME,
      symbol: SYMBOL,
      base: TOKENS.EURS.address,
      quote: TOKENS.USDC.address,
      baseWeight: parseUnits("0.4"),
      quoteWeight: parseUnits("0.6"),
      baseAssimilator: assimilator["EURS"].address,
      quoteAssimilator: quoteAssimilatorAddr.address,
      params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
    });

    try {
      await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.EURS.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: assimilator["EURS"].address,
        quoteAssimilator: quoteAssimilatorAddr.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });
      throw new Error("newCurve should throw error");
    } catch (e) {
      expect(e.toString()).to.include("CurveFactory/currency-pair-already-exists");
    }

    const curveUsdcAddress = await curveFactory.curves(
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "uint256"], [TOKENS.EURS.address, TOKENS.USDC.address])),
    );

    expect(curve.address.toLowerCase()).to.be.eq(curveUsdcAddress.toLowerCase());
  });

  it("XSGD:USDC - No duplicate pairs", async function () {
    const NAME = "XSGD";
    const SYMBOL = "XSGD";
    const { curve } = await createCurveAndSetParams({
      name: NAME,
      symbol: SYMBOL,
      base: TOKENS.XSGD.address,
      quote: TOKENS.USDC.address,
      baseWeight: parseUnits("0.4"),
      quoteWeight: parseUnits("0.6"),
      baseAssimilator: assimilator["XSGD"].address,
      quoteAssimilator: quoteAssimilatorAddr.address,
      params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
    });

    try {
      await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.XSGD.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: assimilator["XSGD"].address,
        quoteAssimilator: quoteAssimilatorAddr.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });
      throw new Error("newCurve should throw error");
    } catch (e) {
      expect(e.toString()).to.include("CurveFactory/currency-pair-already-exists");
    }

    const curveUsdcAddress = await curveFactory.curves(
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "uint256"], [TOKENS.XSGD.address, TOKENS.USDC.address])),
    );

    expect(curve.address.toLowerCase()).to.be.eq(curveUsdcAddress.toLowerCase());
  });

  it("CADC:USDC - No duplicate pairs", async function () {
    const NAME = "CADC";
    const SYMBOL = "CADC";
    const { curve } = await createCurveAndSetParams({
      name: NAME,
      symbol: SYMBOL,
      base: TOKENS.CADC.address,
      quote: TOKENS.USDC.address,
      baseWeight: parseUnits("0.4"),
      quoteWeight: parseUnits("0.6"),
      baseAssimilator: assimilator["CADC"].address,
      quoteAssimilator: quoteAssimilatorAddr.address,
      params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
    });

    try {
      await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.CADC.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: assimilator["CADC"].address,
        quoteAssimilator: quoteAssimilatorAddr.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });
      throw new Error("newCurve should throw error");
    } catch (e) {
      expect(e.toString()).to.include("CurveFactory/currency-pair-already-exists");
    }

    const curveUsdcAddress = await curveFactory.curves(
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "uint256"], [TOKENS.CADC.address, TOKENS.USDC.address])),
    );

    expect(curve.address.toLowerCase()).to.be.eq(curveUsdcAddress.toLowerCase());
  });

  it("FXPHP:USDC - No duplicate pairs", async function () {
    const NAME = "FXPHP";
    const SYMBOL = "FXPHP";
    const { curve } = await createCurveAndSetParams({
      name: NAME,
      symbol: SYMBOL,
      base: TOKENS.FXPHP.address,
      quote: TOKENS.USDC.address,
      baseWeight: parseUnits("0.4"),
      quoteWeight: parseUnits("0.6"),
      baseAssimilator: assimilator["FXPHP"].address,
      quoteAssimilator: quoteAssimilatorAddr.address,
      params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
    });

    try {
      await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.FXPHP.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: assimilator["FXPHP"].address,
        quoteAssimilator: quoteAssimilatorAddr.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });
      throw new Error("newCurve should throw error");
    } catch (e) {
      expect(e.toString()).to.include("CurveFactory/currency-pair-already-exists");
    }

    const curveUsdcAddress = await curveFactory.curves(
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "uint256"], [TOKENS.FXPHP.address, TOKENS.USDC.address])),
    );

    expect(curve.address.toLowerCase()).to.be.eq(curveUsdcAddress.toLowerCase());
  });
});
