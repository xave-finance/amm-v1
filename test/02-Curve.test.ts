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

const { ORACLES, TOKENS } = require(path.resolve(__dirname, `tokens/${process.env.NETWORK}/Constants.ts`));

import { getFutureTime } from "./Utils";
import { formatUnits } from "ethers/lib/utils";
import { CONFIG } from "./Config";

chai.use(chaiBigNumber(BigNumber));

const { parseUnits } = ethers.utils;

const DIMENSION = {
  alpha: parseUnits(CONFIG.DIMENSION_ALPHA),
  beta: parseUnits(CONFIG.DIMENSION_BETA),
  max: parseUnits(CONFIG.DIMENSION_MAX),
  epsilon: parseUnits(CONFIG.DIMENSION_EPSILON),
  lambda: parseUnits(CONFIG.DIMENSION_LAMBDA)
}

describe("Curve Contract", () => {
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

  let mintAndApprove: (tokenAddress: string, minter: Signer, amount: BigNumberish, recipient: string) => Promise<void>;
  let multiMintAndApprove: (requests: [string, Signer, BigNumberish, string][]) => Promise<void>;

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
      eurs,
      xsgd,
      fxphp,

      erc20
    } = await scaffoldTest());

    assimilator = {
      'EURS': eursToUsdAssimilator,
      'XSGD': xsgdToUsdAssimilator,
      'CADC': cadcToUsdAssimilator,
      'FXPHP': fxphpToUsdAssimilator,
    };

    curveFactory = (await CurveFactory.deploy()) as CurveFactory;
    router = (await RouterFactory.deploy(curveFactory.address)) as Router;

    ({ createCurveAndSetParams, mintAndApprove, multiMintAndApprove } = await scaffoldHelpers({
      curveFactory,
      erc20,
    }));

    const mainnetUsdcAssimilator = require(path.resolve(__dirname, `../scripts/config/usdcassimilator/${process.env.NETWORK}.json`));
    quoteAssimilatorAddr = process.env.NETWORK === 'mainnet' ? mainnetUsdcAssimilator : usdcToUsdAssimilator;
  });

  describe("Should still deposit if under cap", async () => {
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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.EURS.address, user1, parseUnits("10000000", TOKENS.EURS.decimals), curve.address],
      ]);

      await curve.deposit(parseUnits("100"), await getFutureTime());

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(lpAmountAfter).to.be.equal(parseUnits("100"));
    });

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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS.XSGD.decimals), curve.address],
      ]);

      await curve.deposit(parseUnits("100"), await getFutureTime());

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(lpAmountAfter).to.be.equal(parseUnits("100"));
    });

    it("CADC:USDC", async () => {
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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.CADC.address, user1, parseUnits("10000000", TOKENS.CADC.decimals), curve.address],
      ]);

      await curve.deposit(parseUnits("100"), await getFutureTime());

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(lpAmountAfter).to.be.equal(parseUnits("100"));
    });

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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.FXPHP.address, user1, parseUnits("10000000", TOKENS.FXPHP.decimals), curve.address],
      ]);

      await curve.deposit(parseUnits("100"), await getFutureTime());

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(lpAmountAfter).to.be.equal(parseUnits("100"));
    });
  });

  describe("Should still view deposit if under cap", async () => {
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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.EURS.address, user1, parseUnits("10000000", TOKENS.EURS.decimals), curve.address],
      ]);

      const result = await curve.viewDeposit(parseUnits("100"));
      expect(result[0]).to.be.equal(parseUnits("100"));
    });

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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS.XSGD.decimals), curve.address],
      ]);

      const result = await curve.viewDeposit(parseUnits("100"));
      expect(result[0]).to.be.equal(parseUnits("100"));
    });

    it("CADC:USDC", async () => {
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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.CADC.address, user1, parseUnits("10000000", TOKENS.CADC.decimals), curve.address],
      ]);

      const result = await curve.viewDeposit(parseUnits("100"));
      expect(result[0]).to.be.equal(parseUnits("100"));
    });

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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.FXPHP.address, user1, parseUnits("10000000", TOKENS.FXPHP.decimals), curve.address],
      ]);

      const result = await curve.viewDeposit(parseUnits("100"));
      expect(result[0]).to.be.equal(parseUnits("100"));
    });
  })

  describe("Should still deposit if under cap not set", async () => {
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

      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(0);

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.EURS.address, user1, parseUnits("10000000", TOKENS.EURS.decimals), curve.address],
      ]);

      await curve.deposit(parseUnits("100"), await getFutureTime());

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(lpAmountAfter).to.be.equal(parseUnits("100"));
    });

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

      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(0);

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS.XSGD.decimals), curve.address],
      ]);

      await curve.deposit(parseUnits("100"), await getFutureTime());

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(lpAmountAfter).to.be.equal(parseUnits("100"));
    });

    it("CADC:USDC", async () => {
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

      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(0);

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.CADC.address, user1, parseUnits("10000000", TOKENS.CADC.decimals), curve.address],
      ]);

      await curve.deposit(parseUnits("100"), await getFutureTime());

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(lpAmountAfter).to.be.equal(parseUnits("100"));
    });

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

      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(0);

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.FXPHP.address, user1, parseUnits("10000000", TOKENS.FXPHP.decimals), curve.address],
      ]);

      await curve.deposit(parseUnits("100"), await getFutureTime());

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(lpAmountAfter).to.be.equal(parseUnits("100"));
    });
  });

  describe("Should still view deposit if cap not set", async () => {
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

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.EURS.address, user1, parseUnits("10000000", TOKENS.EURS.decimals), curve.address],
      ]);

      const result = await curve.viewDeposit(parseUnits("100"));
      expect(result[0]).to.be.equal(parseUnits("100"));
    });

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

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS.XSGD.decimals), curve.address],
      ]);

      const result = await curve.viewDeposit(parseUnits("100"));
      expect(result[0]).to.be.equal(parseUnits("100"));
    });

    it("CADC:USDC", async () => {
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

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.CADC.address, user1, parseUnits("10000000", TOKENS.CADC.decimals), curve.address],
      ]);

      const result = await curve.viewDeposit(parseUnits("100"));
      expect(result[0]).to.be.equal(parseUnits("100"));
    });

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

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.FXPHP.address, user1, parseUnits("10000000", TOKENS.FXPHP.decimals), curve.address],
      ]);

      const result = await curve.viewDeposit(parseUnits("100"));
      expect(result[0]).to.be.equal(parseUnits("100"));
    });
  });

  describe("Should not be able to deposit if over cap", async () => {
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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.EURS.address, user1, parseUnits("10000000", TOKENS.EURS.decimals), curve.address],
      ]);

      try {
        await curve.deposit(parseUnits("10001"), await getFutureTime());
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("Curve/amount-too-large");
      }

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(lpAmountAfter).to.be.equal(0);
    });

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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS.XSGD.decimals), curve.address],
      ]);

      try {
        await curve.deposit(parseUnits("10001"), await getFutureTime());
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("Curve/amount-too-large");
      }

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(lpAmountAfter).to.be.equal(0);
    });

    it("CADC:USDC", async () => {
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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.CADC.address, user1, parseUnits("10000000", TOKENS.CADC.decimals), curve.address],
      ]);

      try {
        await curve.deposit(parseUnits("10001"), await getFutureTime());
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("Curve/amount-too-large");
      }

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(lpAmountAfter).to.be.equal(0);
    });

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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.FXPHP.address, user1, parseUnits("10000000", TOKENS.FXPHP.decimals), curve.address],
      ]);

      try {
        await curve.deposit(parseUnits("10001"), await getFutureTime());
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("Curve/amount-too-large");
      }

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(lpAmountAfter).to.be.equal(0);
    });
  });

  describe("Should not be able to view deposit if over cap", async () => {
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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.EURS.address, user1, parseUnits("10000000", TOKENS.EURS.decimals), curve.address],
      ]);

      try {
        await curve.viewDeposit(parseUnits("10001"));
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("Curve/amount-too-large");
      };
    });

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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS.XSGD.decimals), curve.address],
      ]);

      try {
        await curve.viewDeposit(parseUnits("10001"));
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("Curve/amount-too-large");
      };
    });

    it("CADC:USDC", async () => {
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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.CADC.address, user1, parseUnits("10000000", TOKENS.CADC.decimals), curve.address],
      ]);

      try {
        await curve.viewDeposit(parseUnits("10001"));
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("Curve/amount-too-large");
      };
    });

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

      await curve.setCap(parseUnits("10000"));
      const _curve = await curve.curve();
      expect(_curve.cap).to.eq(parseUnits("10000"));

      const liquidity = await curve.liquidity();
      expect(liquidity.total_).to.eq(0);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.FXPHP.address, user1, parseUnits("10000000", TOKENS.FXPHP.decimals), curve.address],
      ]);

      try {
        await curve.viewDeposit(parseUnits("10001"));
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("Curve/amount-too-large");
      };
    });
  });

  describe("No duplicate pairs", async () => {
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

      try {
        await createCurveAndSetParams({
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
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("CurveFactory/currency-pair-already-exist");
      }
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

      try {
        await createCurveAndSetParams({
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
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("CurveFactory/currency-pair-already-exist");
      }
    })

    it("CADC:USDC", async () => {
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

      try {
        await createCurveAndSetParams({
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
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("CurveFactory/currency-pair-already-exist");
      }
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

      try {
        await createCurveAndSetParams({
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
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("CurveFactory/currency-pair-already-exist");
      }
    })
  });

  describe("Set Dimensions", async () => {
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

      const tx = await curve.setParams(
        DIMENSION.alpha,
        DIMENSION.beta,
        DIMENSION.max,
        DIMENSION.epsilon,
        DIMENSION.lambda
      );

      await tx.wait();
      const txR = await ethers.provider.getTransactionReceipt(tx.hash);
      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.EURS.address, TOKENS.USDC.address);

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      expect(txR.blockNumber).to.not.equal("");
      expect(txR.blockNumber).to.not.equal(undefined);
      expect(txR.blockNumber).to.not.be.null;
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

      const tx = await curve.setParams(
        DIMENSION.alpha,
        DIMENSION.beta,
        DIMENSION.max,
        DIMENSION.epsilon,
        DIMENSION.lambda
      );

      await tx.wait();
      const txR = await ethers.provider.getTransactionReceipt(tx.hash);
      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.XSGD.address, TOKENS.USDC.address);

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      expect(txR.blockNumber).to.not.equal("");
      expect(txR.blockNumber).to.not.equal(undefined);
      expect(txR.blockNumber).to.not.be.null;
    })

    it("CADC:USDC", async () => {
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

      const tx = await curve.setParams(
        DIMENSION.alpha,
        DIMENSION.beta,
        DIMENSION.max,
        DIMENSION.epsilon,
        DIMENSION.lambda
      );

      await tx.wait();
      const txR = await ethers.provider.getTransactionReceipt(tx.hash);
      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.CADC.address, TOKENS.USDC.address);

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      expect(txR.blockNumber).to.not.equal("");
      expect(txR.blockNumber).to.not.equal(undefined);
      expect(txR.blockNumber).to.not.be.null;
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

      const tx = await curve.setParams(
        DIMENSION.alpha,
        DIMENSION.beta,
        DIMENSION.max,
        DIMENSION.epsilon,
        DIMENSION.lambda
      );

      await tx.wait();
      const txR = await ethers.provider.getTransactionReceipt(tx.hash);
      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.FXPHP.address, TOKENS.USDC.address);

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      expect(txR.blockNumber).to.not.equal("");
      expect(txR.blockNumber).to.not.equal(undefined);
      expect(txR.blockNumber).to.not.be.null;
    })
  });

  describe("Emergency Withdraw", async () => {
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

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.EURS.address, user1, parseUnits("10000000", TOKENS.EURS.decimals), curve.address],
      ]);

      // Deposit
      const amt = parseUnits("1000000");
      await curve
        .deposit(amt, await getFutureTime(), { gasPrice: 0 })
        .then(x => x.wait());

      const lpAmountBefore = await curve.balanceOf(user1Address);

      expect(formatUnits(lpAmountBefore)).to.be.equal(formatUnits(amt));

      // Enable emergency withdraw
      expect(await curve.emergency()).to.be.equal(false);
      await curve.setEmergency(true);
      expect(await curve.emergency()).to.be.equal(true);

      // Withdraw everything
      await curve
        .emergencyWithdraw(lpAmountBefore, await getFutureTime(), { gasPrice: 0 })
        .then(x => x.wait());

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(formatUnits(lpAmountAfter)).to.be.equal(formatUnits(parseUnits("0")));
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

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS.XSGD.decimals), curve.address],
      ]);

      // Deposit
      const amt = parseUnits("1000000");
      await curve
        .deposit(amt, await getFutureTime(), { gasPrice: 0 })
        .then(x => x.wait());

      const lpAmountBefore = await curve.balanceOf(user1Address);

      expect(formatUnits(lpAmountBefore)).to.be.equal(formatUnits(amt));

      // Enable emergency withdraw
      expect(await curve.emergency()).to.be.equal(false);
      await curve.setEmergency(true);
      expect(await curve.emergency()).to.be.equal(true);

      // Withdraw everything
      await curve
        .emergencyWithdraw(lpAmountBefore, await getFutureTime(), { gasPrice: 0 })
        .then(x => x.wait());

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(formatUnits(lpAmountAfter)).to.be.equal(formatUnits(parseUnits("0")));
    })

    it("CADC:USDC", async () => {
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

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.CADC.address, user1, parseUnits("10000000", TOKENS.CADC.decimals), curve.address],
      ]);

      // Deposit
      const amt = parseUnits("1000000");
      await curve
        .deposit(amt, await getFutureTime(), { gasPrice: 0 })
        .then(x => x.wait());

      const lpAmountBefore = await curve.balanceOf(user1Address);

      expect(formatUnits(lpAmountBefore)).to.be.equal(formatUnits(amt));

      // Enable emergency withdraw
      expect(await curve.emergency()).to.be.equal(false);
      await curve.setEmergency(true);
      expect(await curve.emergency()).to.be.equal(true);

      // Withdraw everything
      await curve
        .emergencyWithdraw(lpAmountBefore, await getFutureTime(), { gasPrice: 0 })
        .then(x => x.wait());

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(formatUnits(lpAmountAfter)).to.be.equal(formatUnits(parseUnits("0")));
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

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.FXPHP.address, user1, parseUnits("1000000000", TOKENS.FXPHP.decimals), curve.address],
      ]);

      // Deposit
      const amt = parseUnits("1000000");
      await curve
        .deposit(amt, await getFutureTime(), { gasPrice: 0 })
        .then(x => x.wait());

      const lpAmountBefore = await curve.balanceOf(user1Address);

      expect(formatUnits(lpAmountBefore)).to.be.equal(formatUnits(amt));

      // Enable emergency withdraw
      expect(await curve.emergency()).to.be.equal(false);
      await curve.setEmergency(true);
      expect(await curve.emergency()).to.be.equal(true);

      // Withdraw everything
      await curve
        .emergencyWithdraw(lpAmountBefore, await getFutureTime(), { gasPrice: 0 })
        .then(x => x.wait());

      const lpAmountAfter = await curve.balanceOf(user1Address);
      expect(formatUnits(lpAmountAfter)).to.be.equal(formatUnits(parseUnits("0")));
    })
  });

  describe("Freeze and Unfreeze Curve", async () => {
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

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      // Curve is not frozen by default
      expect(await curve.frozen()).to.be.false;
      // Freeze Curve
      await curve
        .setFrozen(true)
        .then(x => x.wait());
      expect(await curve.frozen()).to.be.true;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.EURS.address, user1, parseUnits("10000000", TOKENS.EURS.decimals), curve.address],
      ]);

      try {
        // Deposit
        const amt = parseUnits("1000000");

        // Deposit should not go through
        await curve
          .deposit(amt, await getFutureTime(), { gasPrice: 0 })
          .then(x => x.wait());
        throw new Error("Curve is frozen");
      } catch (e) {
        expect(e.toString()).to.include("Curve/frozen-only-allowing-proportional-withdraw");
      }

      const lpAmountA = await curve.balanceOf(user1Address);
      // Balance is still zero
      expect(formatUnits(lpAmountA)).to.be.equal(formatUnits(parseUnits("0")));

      // Unfreeze Curve
      await curve
        .setFrozen(false)
        .then(x => x.wait());
      expect(await curve.frozen()).to.be.false;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.EURS.address, user1, parseUnits("10000000", TOKENS.EURS.decimals), curve.address],
      ]);

      // Deposit
      const amt = parseUnits("1000000");
      await curve
        .deposit(amt, await getFutureTime(), { gasPrice: 0 })
        .then(x => x.wait());

      // Balance is now equal to amt
      const lpAmountB = await curve.balanceOf(user1Address);
      expect(formatUnits(lpAmountB)).to.be.equal(formatUnits(amt));
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

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      // Curve is not frozen by default
      expect(await curve.frozen()).to.be.false;
      // Freeze Curve
      await curve
        .setFrozen(true)
        .then(x => x.wait());
      expect(await curve.frozen()).to.be.true;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS.XSGD.decimals), curve.address],
      ]);

      try {
        // Deposit
        const amt = parseUnits("1000000");

        // Deposit should not go through
        await curve
          .deposit(amt, await getFutureTime(), { gasPrice: 0 })
          .then(x => x.wait());
        throw new Error("Curve is frozen");
      } catch (e) {
        expect(e.toString()).to.include("Curve/frozen-only-allowing-proportional-withdraw");
      }

      const lpAmountA = await curve.balanceOf(user1Address);
      // Balance is still zero
      expect(formatUnits(lpAmountA)).to.be.equal(formatUnits(parseUnits("0")));

      // Unfreeze Curve
      await curve
        .setFrozen(false)
        .then(x => x.wait());
      expect(await curve.frozen()).to.be.false;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS.XSGD.decimals), curve.address],
      ]);

      // Deposit
      const amt = parseUnits("1000000");
      await curve
        .deposit(amt, await getFutureTime(), { gasPrice: 0 })
        .then(x => x.wait());

      // Balance is now equal to amt
      const lpAmountB = await curve.balanceOf(user1Address);
      expect(formatUnits(lpAmountB)).to.be.equal(formatUnits(amt));
    })

    it("CADC:USDC", async () => {
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

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      // Curve is not frozen by default
      expect(await curve.frozen()).to.be.false;
      // Freeze Curve
      await curve
        .setFrozen(true)
        .then(x => x.wait());
      expect(await curve.frozen()).to.be.true;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.CADC.address, user1, parseUnits("10000000", TOKENS.CADC.decimals), curve.address],
      ]);

      try {
        // Deposit
        const amt = parseUnits("1000000");

        // Deposit should not go through
        await curve
          .deposit(amt, await getFutureTime(), { gasPrice: 0 })
          .then(x => x.wait());
        throw new Error("Curve is frozen");
      } catch (e) {
        expect(e.toString()).to.include("Curve/frozen-only-allowing-proportional-withdraw");
      }

      const lpAmountA = await curve.balanceOf(user1Address);
      // Balance is still zero
      expect(formatUnits(lpAmountA)).to.be.equal(formatUnits(parseUnits("0")));

      // Unfreeze Curve
      await curve
        .setFrozen(false)
        .then(x => x.wait());
      expect(await curve.frozen()).to.be.false;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.CADC.address, user1, parseUnits("10000000", TOKENS.CADC.decimals), curve.address],
      ]);

      // Deposit
      const amt = parseUnits("1000000");
      await curve
        .deposit(amt, await getFutureTime(), { gasPrice: 0 })
        .then(x => x.wait());

      // Balance is now equal to amt
      const lpAmountB = await curve.balanceOf(user1Address);
      expect(formatUnits(lpAmountB)).to.be.equal(formatUnits(amt));
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

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      // Curve is not frozen by default
      expect(await curve.frozen()).to.be.false;
      // Freeze Curve
      await curve
        .setFrozen(true)
        .then(x => x.wait());
      expect(await curve.frozen()).to.be.true;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.FXPHP.address, user1, parseUnits("10000000000", TOKENS.FXPHP.decimals), curve.address],
      ]);

      try {
        // Deposit
        const amt = parseUnits("1000000");

        // Deposit should not go through
        await curve
          .deposit(amt, await getFutureTime(), { gasPrice: 0 })
          .then(x => x.wait());
        throw new Error("Curve is frozen");
      } catch (e) {
        expect(e.toString()).to.include("Curve/frozen-only-allowing-proportional-withdraw");
      }

      const lpAmountA = await curve.balanceOf(user1Address);
      // Balance is still zero
      expect(formatUnits(lpAmountA)).to.be.equal(formatUnits(parseUnits("0")));

      // Unfreeze Curve
      await curve
        .setFrozen(false)
        .then(x => x.wait());
      expect(await curve.frozen()).to.be.false;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
        [TOKENS.FXPHP.address, user1, parseUnits("10000000000", TOKENS.FXPHP.decimals), curve.address],
      ]);

      // Deposit
      const amt = parseUnits("1000000");
      await curve
        .deposit(amt, await getFutureTime(), { gasPrice: 0 })
        .then(x => x.wait());

      // Balance is now equal to amt
      const lpAmountB = await curve.balanceOf(user1Address);
      expect(formatUnits(lpAmountB)).to.be.equal(formatUnits(amt));
    })
  });
});