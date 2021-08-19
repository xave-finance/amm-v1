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

    ({ createCurveAndSetParams } = await scaffoldHelpers({
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
});