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

import { getFutureTime } from "./Utils";
import { formatUnits } from "ethers/lib/utils";

chai.use(chaiBigNumber(BigNumber));

const { parseUnits } = ethers.utils;

const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
const TOKENS_CADC_DECIMALS = process.env.TOKENS_CADC_DECIMALS;
const TOKENS_EURS_DECIMALS = process.env.TOKENS_EURS_DECIMALS;
const TOKENS_XSGD_DECIMALS = process.env.TOKENS_XSGD_DECIMALS;

const DIMENSION = {
  alpha: parseUnits(process.env.DIMENSION_ALPHA),
  beta: parseUnits(process.env.DIMENSION_BETA),
  max: parseUnits(process.env.DIMENSION_MAX),
  epsilon: parseUnits(process.env.DIMENSION_EPSILON),
  lambda: parseUnits(process.env.DIMENSION_LAMBDA)
}

describe("Curve Contract", () => {
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

  let usdc: ERC20;
  let cadc: ERC20;
  let eurs: ERC20;
  let xsgd: ERC20;
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
      cadcToUsdAssimilator,
      usdcToUsdAssimilator,
      eursToUsdAssimilator,
      xsgdToUsdAssimilator,
      CurveFactory,
      RouterFactory,
      usdc,
      cadc,
      eurs,
      xsgd,
      erc20
    } = await scaffoldTest());


    curveFactory = (await CurveFactory.deploy()) as CurveFactory;
    router = (await RouterFactory.deploy(curveFactory.address)) as Router;

    ({ createCurveAndSetParams, mintAndApprove, multiMintAndApprove } = await scaffoldHelpers({
      curveFactory,
      erc20,
    }));
  });

  describe("Curve/Pair Creation", async () => {
    it("CADC:USDC", async () => {
      const NAME = "CAD Coin";
      const SYMBOL = "CADC";

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

      const curveAddress = await curveFactory.curves(
        ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "uint256"], [cadc.address, usdc.address])),
      );

      assert(ethers.utils.isAddress(curve.address));
      expect(curve.address.toLowerCase()).to.be.eq(curveAddress.toLowerCase());
    })

    it("EURS:USDC", async () => {
      const NAME = "EURS Statis";
      const SYMBOL = "EURS";

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.EURS.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: eursToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const curveAddress = await curveFactory.curves(
        ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "uint256"], [eurs.address, usdc.address])),
      );

      assert(ethers.utils.isAddress(curve.address));
      expect(curve.address.toLowerCase()).to.be.eq(curveAddress.toLowerCase());
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
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const curveAddress = await curveFactory.curves(
        ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "uint256"], [xsgd.address, usdc.address])),
      );

      assert(ethers.utils.isAddress(curve.address));
      expect(curve.address.toLowerCase()).to.be.eq(curveAddress.toLowerCase());
    })

    it("No duplicate pairs for CADC:USDC", async () => {
      const NAME = "CAD Coin";
      const SYMBOL = "CADC";

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

      try {
        await createCurveAndSetParams({
          name: NAME,
          symbol: SYMBOL,
          base: cadc.address,
          quote: usdc.address,
          baseWeight: parseUnits("0.4"),
          quoteWeight: parseUnits("0.6"),
          baseAssimilator: cadcToUsdAssimilator.address,
          quoteAssimilator: usdcToUsdAssimilator.address,
          params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
        });
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("CurveFactory/currency-pair-already-exists");
      }
    })

    it("No duplicate pairs for EURS:USDC", async () => {
      const NAME = "EURS Statis";
      const SYMBOL = "EURS";

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.EURS.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: eursToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      try {
        await createCurveAndSetParams({
          name: NAME,
          symbol: SYMBOL,
          base: eurs.address,
          quote: usdc.address,
          baseWeight: parseUnits("0.4"),
          quoteWeight: parseUnits("0.6"),
          baseAssimilator: eursToUsdAssimilator.address,
          quoteAssimilator: usdcToUsdAssimilator.address,
          params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
        });
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("CurveFactory/currency-pair-already-exist");
      }
    })

    it("No duplicate pairs for XSGD:USDC", async () => {
      const NAME = "XSGD Statis";
      const SYMBOL = "XSGD";

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.XSGD.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      try {
        await createCurveAndSetParams({
          name: NAME,
          symbol: SYMBOL,
          base: xsgd.address,
          quote: usdc.address,
          baseWeight: parseUnits("0.4"),
          quoteWeight: parseUnits("0.6"),
          baseAssimilator: xsgdToUsdAssimilator.address,
          quoteAssimilator: usdcToUsdAssimilator.address,
          params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
        });
        throw new Error("newCurve should throw error");
      } catch (e) {
        expect(e.toString()).to.include("CurveFactory/currency-pair-already-exist");
      }
    })
  })

  describe("Set Dimensions", async () => {
    it("CADC:USDC", async () => {
      const NAME = "CAD Coin";
      const SYMBOL = "CADC";

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

    it("EURS:USDC", async () => {
      const NAME = "EURS Statis";
      const SYMBOL = "EURS";

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.EURS.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: eursToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
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
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
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
  });

  describe("Turn Off Whitelisting", async () => {
    it("CADC:USDC", async () => {
      const NAME = "CAD Coin";
      const SYMBOL = "CADC";

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

      const txR = await curve.turnOffWhitelisting();
      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.CADC.address, TOKENS.USDC.address);

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      expect(txR.blockNumber).to.not.equal("");
      expect(txR.blockNumber).to.not.equal(undefined);
      expect(txR.blockNumber).to.not.be.null;
    })

    it("EURS:USDC", async () => {
      const NAME = "EURS Statis";
      const SYMBOL = "EURS";

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.EURS.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: eursToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const txR = await curve.turnOffWhitelisting();
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
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const txR = await curve.turnOffWhitelisting();
      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.XSGD.address, TOKENS.USDC.address);

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      expect(txR.blockNumber).to.not.equal("");
      expect(txR.blockNumber).to.not.equal(undefined);
      expect(txR.blockNumber).to.not.be.null;
    })
  });

  describe("Emergency Withdraw", async () => {
    it("CADC:USDC", async () => {
      const NAME = "CAD Coin";
      const SYMBOL = "CADC";

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

      const txR = await curve.turnOffWhitelisting();
      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.CADC.address, TOKENS.USDC.address);

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      expect(txR.blockNumber).to.not.equal("");
      expect(txR.blockNumber).to.not.equal(undefined);
      expect(txR.blockNumber).to.not.be.null;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS_USDC_DECIMALS), curve.address],
        [TOKENS.CADC.address, user1, parseUnits("10000000", TOKENS_CADC_DECIMALS), curve.address],
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

    it("EURS:USDC", async () => {
      const NAME = "EURS Statis";
      const SYMBOL = "EURS";

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.EURS.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: eursToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const txR = await curve.turnOffWhitelisting();
      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.EURS.address, TOKENS.USDC.address);

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      expect(txR.blockNumber).to.not.equal("");
      expect(txR.blockNumber).to.not.equal(undefined);
      expect(txR.blockNumber).to.not.be.null;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS_USDC_DECIMALS), curve.address],
        [TOKENS.EURS.address, user1, parseUnits("10000000", TOKENS_EURS_DECIMALS), curve.address],
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
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const txR = await curve.turnOffWhitelisting();
      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.XSGD.address, TOKENS.USDC.address);

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      expect(txR.blockNumber).to.not.equal("");
      expect(txR.blockNumber).to.not.equal(undefined);
      expect(txR.blockNumber).to.not.be.null;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS_USDC_DECIMALS), curve.address],
        [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS_XSGD_DECIMALS), curve.address],
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
    it("CADC:USDC", async () => {
      const NAME = "CAD Coin";
      const SYMBOL = "CADC";

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

      const txR = await curve.turnOffWhitelisting();
      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.CADC.address, TOKENS.USDC.address);

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      expect(txR.blockNumber).to.not.equal("");
      expect(txR.blockNumber).to.not.equal(undefined);
      expect(txR.blockNumber).to.not.be.null;

      // Curve is not frozen by default
      expect(await curve.frozen()).to.be.false;
      // Freeze Curve
      await curve
        .setFrozen(true)
        .then(x => x.wait());
      expect(await curve.frozen()).to.be.true;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS_USDC_DECIMALS), curve.address],
        [TOKENS.CADC.address, user1, parseUnits("10000000", TOKENS_CADC_DECIMALS), curve.address],
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
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS_USDC_DECIMALS), curve.address],
        [TOKENS.CADC.address, user1, parseUnits("10000000", TOKENS_CADC_DECIMALS), curve.address],
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

    it("EURS:USDC", async () => {
      const NAME = "EURS Statis";
      const SYMBOL = "EURS";

      const { curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.EURS.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits("0.4"),
        quoteWeight: parseUnits("0.6"),
        baseAssimilator: eursToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const txR = await curve.turnOffWhitelisting();
      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.EURS.address, TOKENS.USDC.address);

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      expect(txR.blockNumber).to.not.equal("");
      expect(txR.blockNumber).to.not.equal(undefined);
      expect(txR.blockNumber).to.not.be.null;

      // Curve is not frozen by default
      expect(await curve.frozen()).to.be.false;
      // Freeze Curve
      await curve
        .setFrozen(true)
        .then(x => x.wait());
      expect(await curve.frozen()).to.be.true;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS_USDC_DECIMALS), curve.address],
        [TOKENS.EURS.address, user1, parseUnits("10000000", TOKENS_EURS_DECIMALS), curve.address],
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
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS_USDC_DECIMALS), curve.address],
        [TOKENS.EURS.address, user1, parseUnits("10000000", TOKENS_EURS_DECIMALS), curve.address],
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
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });

      const txR = await curve.turnOffWhitelisting();
      const curveAddrA = curve.address;
      const curveAddrB = await curveFactory.getCurve(TOKENS.XSGD.address, TOKENS.USDC.address);

      assert(ethers.utils.isAddress(curveAddrA));
      assert(ethers.utils.isAddress(curveAddrB));
      expect(curveAddrA).to.be.equal(curveAddrB);

      expect(txR.blockNumber).to.not.equal("");
      expect(txR.blockNumber).to.not.equal(undefined);
      expect(txR.blockNumber).to.not.be.null;

      // Curve is not frozen by default
      expect(await curve.frozen()).to.be.false;
      // Freeze Curve
      await curve
        .setFrozen(true)
        .then(x => x.wait());
      expect(await curve.frozen()).to.be.true;

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS_USDC_DECIMALS), curve.address],
        [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS_XSGD_DECIMALS), curve.address],
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
        [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS_USDC_DECIMALS), curve.address],
        [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS_XSGD_DECIMALS), curve.address],
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