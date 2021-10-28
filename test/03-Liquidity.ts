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

import { getFutureTime, unlockAccountAndGetSigner, previewDepositGivenBase, previewDepositGivenQuote, adjustViewDeposit } from "./Utils";
import { formatUnits, formatEther } from "ethers/lib/utils";

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
  let curve: Curve;

  let CurveFactory: ContractFactory;
  let RouterFactory: ContractFactory;

  let curveFactory: CurveFactory;
  let router: Router;

  let usdc: ERC20;
  let cadc: ERC20;
  let eurs: ERC20;
  let xsgd: ERC20;
  let erc20: ERC20;
  let baseToken: ERC20;
  let quoteToken: ERC20;
  const maxDeposit: number = 90000000;
  const maxSwap: number = 90000000;

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

  before(async function () {
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

  describe("viewDeposit on XSGD/USDC curve", () => {
    const tokenQuote = "XSGD";

    before(async () => {
      const NAME = `Token ${tokenQuote}`;
      const SYMBOL = tokenQuote;
      baseToken = (await ethers.getContractAt("ERC20", TOKENS[tokenQuote].address)) as ERC20;
      quoteToken = (await ethers.getContractAt("ERC20", TOKENS.USDC.address)) as ERC20;

      ({ curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS[tokenQuote].address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits(".5"),
        quoteWeight: parseUnits(".5"),
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      }));

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS[tokenQuote].address, user1, parseUnits("90000000000", TOKENS[tokenQuote].decimals), curve.address],
        [TOKENS.USDC.address, user1, parseUnits("90000000000", TOKENS.USDC.decimals), curve.address],
      ]);
    });

    describe("given quote as input", () => {
      for (let deposit = 1; deposit <= maxDeposit; deposit *= 1.1) {
        it(`it returns estimated quote similar to input quote: ${deposit}`, async () => {
          // Specific for EURS only
          // 22k 
          deposit = deposit === 1 ? 11000 : deposit;

          // Estimate deposit given quote
          const depositPreview = await adjustViewDeposit(
            "quote",
            await previewDepositGivenQuote(deposit, tokenQuote, curve),
            deposit,
            TOKENS.USDC.decimals,
            curve
          );

          deposit = 1;

          // User input should be gte the estimate quote
          expect(parseUnits(deposit.toString()).gte(depositPreview.quote))

          const baseBalA: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalA: BigNumber = await quoteToken.balanceOf(user1Address);

          // Deposit
          await curve.deposit(parseUnits(depositPreview.deposit.toString()), await getFutureTime());

          const baseBalB: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalB: BigNumber = await quoteToken.balanceOf(user1Address);

          // Compare balance before and after deposit
          expect(baseBalA.sub(depositPreview.base).gte(baseBalB)).to.be.true;
          expect(quoteBalA.sub(depositPreview.quote).gte(quoteBalB)).to.be.true;
        });
      }
    });

    describe("given base as input", () => {
      for (let deposit = 1; deposit <= maxDeposit; deposit *= 1.1) {
        it(`it returns estimated base similar to input base: ${deposit}`, async () => {
          // Preview given base
          const rateBase = Number(formatUnits(await xsgdToUsdAssimilator.getRate(), 8));
          const liquidity = await curve.liquidity();
          const liquidityTotal = parseFloat(formatUnits(liquidity.total_));
          const numeraireBase = parseFloat(formatUnits(liquidity.individual_[0]));
          const weightBase = numeraireBase / liquidityTotal;

          // Estimate deposit given base
          const depositPreview = await adjustViewDeposit(
            "base",
            await previewDepositGivenBase(deposit, rateBase, tokenQuote, weightBase, curve),
            deposit,
            TOKENS[tokenQuote].decimals,
            curve
          );

          // User input should be gte the estimate base
          expect(parseUnits(deposit.toString()).gte(depositPreview.base))

          const baseBalA: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalA: BigNumber = await quoteToken.balanceOf(user1Address);

          // Deposit
          await curve.deposit(parseUnits(depositPreview.deposit.toString()), await getFutureTime());

          const baseBalB: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalB: BigNumber = await quoteToken.balanceOf(user1Address);

          // Compare balance before and after deposit
          expect(baseBalA.sub(depositPreview.base).gte(baseBalB)).to.be.true;
          expect(quoteBalA.sub(depositPreview.quote).gte(quoteBalB)).to.be.true;
        });
      }
    });

    describe("pool deposit with unbalanced ratio", () => {
      for (let swapAmt = 1; swapAmt < maxSwap; swapAmt *= 5) {
        const amt = parseUnits(swapAmt.toString(), TOKENS[tokenQuote].decimals);

        it(`swapping amount: ${amt}`, async () => {
          await curve
            .originSwap(baseToken.address, TOKENS.USDC.address, amt, 0, await getFutureTime());
          const liquidity = await curve.liquidity();
          const liquidityTotal = parseFloat(formatUnits(liquidity.total_));
          const numeraireBase = parseFloat(formatUnits(liquidity.individual_[0]));
          const weightBase = numeraireBase / liquidityTotal;

          // Estimate deposit given quote
          const depositPreviewGivenQuote = await adjustViewDeposit(
            "quote",
            await previewDepositGivenQuote(swapAmt, tokenQuote, curve),
            swapAmt,
            TOKENS.USDC.decimals,
            curve
          );

          // User input should be gte the estimate quote
          expect(parseUnits(swapAmt.toString()).gte(depositPreviewGivenQuote.quote))

          // Preview given base
          const rateBase = Number(formatUnits(await xsgdToUsdAssimilator.getRate(), 8));
          // Estimate deposit given base
          const depositPreviewGivenBase = await adjustViewDeposit(
            "base",
            await previewDepositGivenBase(swapAmt, rateBase, tokenQuote, weightBase, curve),
            swapAmt,
            TOKENS[tokenQuote].decimals,
            curve
          );

          // User input should be gte the estimate base
          expect(parseUnits(swapAmt.toString()).gte(depositPreviewGivenBase.base))
        });
      }
    });
  });

  describe("viewDeposit on EURS/USDC curve", () => {
    const tokenQuote = "EURS";

    before(async () => {
      const NAME = `Token ${tokenQuote}`;
      const SYMBOL = tokenQuote;
      baseToken = (await ethers.getContractAt("ERC20", TOKENS[tokenQuote].address)) as ERC20;
      quoteToken = (await ethers.getContractAt("ERC20", TOKENS.USDC.address)) as ERC20;

      ({ curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS[tokenQuote].address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits(".5"),
        quoteWeight: parseUnits(".5"),
        baseAssimilator: eursToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      }));

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS[tokenQuote].address, user1, parseUnits("900000000000", TOKENS[tokenQuote].decimals), curve.address],
        [TOKENS.USDC.address, user1, parseUnits("900000000000", TOKENS.USDC.decimals), curve.address],
      ]);
    });

    describe("given quote as input", () => {
      for (let deposit = 1; deposit <= maxDeposit; deposit *= 1.1) {
        it(`it returns estimated quote similar to input quote: ${deposit}`, async () => {
          // Specific for EURS only
          // 22k 
          deposit = deposit === 1 ? 11000 : deposit;

          // Estimate deposit given quote
          const depositPreview = await adjustViewDeposit(
            "quote",
            await previewDepositGivenQuote(deposit, tokenQuote, curve),
            deposit,
            TOKENS.USDC.decimals,
            curve
          );

          deposit = 1;

          // User input should be gte the estimate quote
          expect(parseUnits(deposit.toString()).gte(depositPreview.quote))

          const baseBalA: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalA: BigNumber = await quoteToken.balanceOf(user1Address);

          // Deposit
          await curve.deposit(parseUnits(depositPreview.deposit.toString()), await getFutureTime());

          const baseBalB: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalB: BigNumber = await quoteToken.balanceOf(user1Address);

          // Compare balance before and after deposit
          expect(baseBalA.sub(depositPreview.base).gte(baseBalB)).to.be.true;
          expect(quoteBalA.sub(depositPreview.quote).gte(quoteBalB)).to.be.true;
        });
      }
    });

    describe("given base as input", () => {
      for (let deposit = 1; deposit <= maxDeposit; deposit *= 1.1) {
        it(`it returns estimated base similar to input base: ${deposit}`, async () => {
          // Preview given base
          const rateBase = Number(formatUnits(await eursToUsdAssimilator.getRate(), 8));
          const liquidity = await curve.liquidity();
          const liquidityTotal = parseFloat(formatUnits(liquidity.total_));
          const numeraireBase = parseFloat(formatUnits(liquidity.individual_[0]));
          const weightBase = numeraireBase / liquidityTotal;

          // Estimate deposit given base
          const depositPreview = await adjustViewDeposit(
            "base",
            await previewDepositGivenBase(deposit, rateBase, tokenQuote, weightBase, curve),
            deposit,
            TOKENS[tokenQuote].decimals,
            curve
          );

          // User input should be gte the estimate base
          expect(parseUnits(deposit.toString()).gte(depositPreview.base))

          const baseBalA: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalA: BigNumber = await quoteToken.balanceOf(user1Address);

          // Deposit
          await curve.deposit(parseUnits(depositPreview.deposit.toString()), await getFutureTime());

          const baseBalB: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalB: BigNumber = await quoteToken.balanceOf(user1Address);

          // Compare balance before and after deposit
          expect(baseBalA.sub(depositPreview.base).gte(baseBalB)).to.be.true;
          expect(quoteBalA.sub(depositPreview.quote).gte(quoteBalB)).to.be.true;
        });
      }
    });

    describe("pool deposit with unbalanced ratio", () => {
      for (let swapAmt = 1; swapAmt < maxSwap; swapAmt *= 5) {
        const amt = parseUnits(swapAmt.toString(), TOKENS[tokenQuote].decimals);

        it(`swapping amount: ${amt}`, async () => {
          await curve
            .originSwap(baseToken.address, TOKENS.USDC.address, amt, 0, await getFutureTime());
          const liquidity = await curve.liquidity();
          const liquidityTotal = parseFloat(formatUnits(liquidity.total_));
          const numeraireBase = parseFloat(formatUnits(liquidity.individual_[0]));
          const weightBase = numeraireBase / liquidityTotal;

          // Estimate deposit given quote
          const depositPreviewGivenQuote = await adjustViewDeposit(
            "quote",
            await previewDepositGivenQuote(swapAmt, tokenQuote, curve),
            swapAmt,
            TOKENS.USDC.decimals,
            curve
          );

          // User input should be gte the estimate quote
          expect(parseUnits(swapAmt.toString()).gte(depositPreviewGivenQuote.quote))

          // Preview given base
          const rateBase = Number(formatUnits(await eursToUsdAssimilator.getRate(), 8));
          // Estimate deposit given base
          const depositPreviewGivenBase = await adjustViewDeposit(
            "base",
            await previewDepositGivenBase(swapAmt, rateBase, tokenQuote, weightBase, curve),
            swapAmt,
            TOKENS[tokenQuote].decimals,
            curve
          );

          // User input should be gte the estimate base
          expect(parseUnits(swapAmt.toString()).gte(depositPreviewGivenBase.base))
        });
      }
    });
  });

  describe("viewDeposit on CADC/USDC curve", () => {
    const tokenQuote = "CADC";

    before(async () => {
      const NAME = `Token ${tokenQuote}`;
      const SYMBOL = tokenQuote;
      baseToken = (await ethers.getContractAt("ERC20", TOKENS[tokenQuote].address)) as ERC20;
      quoteToken = (await ethers.getContractAt("ERC20", TOKENS.USDC.address)) as ERC20;

      ({ curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS[tokenQuote].address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits(".5"),
        quoteWeight: parseUnits(".5"),
        baseAssimilator: cadcToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      }));

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS[tokenQuote].address, user1, parseUnits("900000000000", TOKENS[tokenQuote].decimals), curve.address],
        [TOKENS.USDC.address, user1, parseUnits("900000000000", TOKENS.USDC.decimals), curve.address],
      ]);
    });

    describe("given quote as input", () => {
      for (let deposit = 1; deposit <= maxDeposit; deposit *= 1.1) {
        it(`it returns estimated quote similar to input quote: ${deposit}`, async () => {
          // Estimate deposit given quote
          const depositPreview = await adjustViewDeposit(
            "quote",
            await previewDepositGivenQuote(deposit, tokenQuote, curve),
            deposit,
            TOKENS.USDC.decimals,
            curve
          );

          // User input should be gte the estimate quote
          expect(parseUnits(deposit.toString()).gte(depositPreview.quote))

          const baseBalA: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalA: BigNumber = await quoteToken.balanceOf(user1Address);

          // Deposit
          await curve.deposit(parseUnits(depositPreview.deposit.toString()), await getFutureTime());

          const baseBalB: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalB: BigNumber = await quoteToken.balanceOf(user1Address);

          // Compare balance before and after deposit
          expect(baseBalA.sub(depositPreview.base).gte(baseBalB)).to.be.true;
          expect(quoteBalA.sub(depositPreview.quote).gte(quoteBalB)).to.be.true;
        });
      }
    });

    describe("given base as input", () => {
      for (let deposit = 1; deposit <= maxDeposit; deposit *= 1.1) {
        it(`it returns estimated base similar to input base: ${deposit}`, async () => {
          // Preview given base
          const rateBase = Number(formatUnits(await cadcToUsdAssimilator.getRate(), 8));
          const liquidity = await curve.liquidity();
          const liquidityTotal = parseFloat(formatUnits(liquidity.total_));
          const numeraireBase = parseFloat(formatUnits(liquidity.individual_[0]));
          const weightBase = numeraireBase / liquidityTotal;

          // Estimate deposit given base
          const depositPreview = await adjustViewDeposit(
            "base",
            await previewDepositGivenBase(deposit, rateBase, tokenQuote, weightBase, curve),
            deposit,
            TOKENS[tokenQuote].decimals,
            curve
          );

          // User input should be gte the estimate base
          expect(parseUnits(deposit.toString()).gte(depositPreview.base))

          const baseBalA: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalA: BigNumber = await quoteToken.balanceOf(user1Address);

          // Deposit
          await curve.deposit(parseUnits(depositPreview.deposit.toString()), await getFutureTime());

          const baseBalB: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalB: BigNumber = await quoteToken.balanceOf(user1Address);

          // Compare balance before and after deposit
          expect(baseBalA.sub(depositPreview.base).gte(baseBalB)).to.be.true;
          expect(quoteBalA.sub(depositPreview.quote).gte(quoteBalB)).to.be.true;
        });
      }
    });

    describe("pool deposit with unbalanced ratio", () => {
      for (let swapAmt = 1; swapAmt < maxSwap; swapAmt *= 5) {
        const amt = parseUnits(swapAmt.toString(), TOKENS[tokenQuote].decimals);

        it(`swapping amount: ${amt}`, async () => {
          await curve
            .originSwap(baseToken.address, TOKENS.USDC.address, amt, 0, await getFutureTime());
          const liquidity = await curve.liquidity();
          const liquidityTotal = parseFloat(formatUnits(liquidity.total_));
          const numeraireBase = parseFloat(formatUnits(liquidity.individual_[0]));
          const weightBase = numeraireBase / liquidityTotal;

          // Estimate deposit given quote
          const depositPreviewGivenQuote = await adjustViewDeposit(
            "quote",
            await previewDepositGivenQuote(swapAmt, tokenQuote, curve),
            swapAmt,
            TOKENS.USDC.decimals,
            curve
          );

          // User input should be gte the estimate quote
          expect(parseUnits(swapAmt.toString()).gte(depositPreviewGivenQuote.quote))

          // Preview given base
          const rateBase = Number(formatUnits(await cadcToUsdAssimilator.getRate(), 8));
          // Estimate deposit given base
          const depositPreviewGivenBase = await adjustViewDeposit(
            "base",
            await previewDepositGivenBase(swapAmt, rateBase, tokenQuote, weightBase, curve),
            swapAmt,
            TOKENS[tokenQuote].decimals,
            curve
          );

          // User input should be gte the estimate base
          expect(parseUnits(swapAmt.toString()).gte(depositPreviewGivenBase.base))
        });
      }
    });
  });
});