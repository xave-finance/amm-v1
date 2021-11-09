import { ethers } from "hardhat";
import { Signer, Contract, ContractFactory, BigNumber, BigNumberish } from "ethers";
import chai, { expect } from "chai";
import chaiBigNumber from "chai-bignumber";

import { CurveFactory } from "../typechain/CurveFactory";
import { Curve } from "../typechain/Curve";
import { ERC20 } from "../typechain/ERC20";

import { scaffoldTest, scaffoldHelpers } from "./Setup";

import { TOKENS } from "./Constants";
import { CONFIG } from "./Config";

import {
  getFutureTime,
  previewDepositGivenBase,
  previewDepositGivenQuote,
  adjustViewDeposit,
  weightBase
} from "./Utils";
import { formatUnits } from "ethers/lib/utils";

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
  let [user1]: Signer[] = [];
  let [user1Address]: string[] = [];

  let cadcToUsdAssimilator: Contract;
  let usdcToUsdAssimilator: Contract;
  let eursToUsdAssimilator: Contract;
  let xsgdToUsdAssimilator: Contract;
  let curve: Curve;
  let curveLpToken: ERC20;

  let CurveFactory: ContractFactory;

  let curveFactory: CurveFactory;
  let erc20: ERC20;
  let baseToken: ERC20;
  let quoteToken: ERC20;
  let maxDeposit: number = 90000000;
  let maxSwap: number = 90000000;

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
      users: [user1],
      userAddresses: [user1Address],
      cadcToUsdAssimilator,
      usdcToUsdAssimilator,
      eursToUsdAssimilator,
      xsgdToUsdAssimilator,
      CurveFactory,
      erc20
    } = await scaffoldTest());

    curveFactory = (await CurveFactory.deploy()) as CurveFactory;

    ({ createCurveAndSetParams, multiMintAndApprove } = await scaffoldHelpers({
      curveFactory,
      erc20,
    }));
  });

  describe("XSGD/USDC curve deposit, swap and withdraw", () => {
    const tokenQuote = "XSGD";

    before(async () => {
      const NAME = `Token ${tokenQuote}`;
      const SYMBOL = tokenQuote;
      baseToken = (await ethers.getContractAt("ERC20", TOKENS[tokenQuote].address)) as ERC20;
      quoteToken = (await ethers.getContractAt("ERC20", TOKENS.USDC.address)) as ERC20;

      ({ curve, curveLpToken } = await createCurveAndSetParams({
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
      for (let deposit = 1; deposit <= maxDeposit; deposit *= 5) {
        it.only(`it returns estimated quote similar to input quote: ${deposit}`, async () => {
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
      for (let deposit = 1; deposit <= maxDeposit; deposit *= 5) {
        it.only(`it returns estimated base similar to input base: ${deposit}`, async () => {
          // Preview given base
          const rateBase = Number(formatUnits(await xsgdToUsdAssimilator.getRate(), 8));
          const liquidity = await curve.liquidity();
          const ratio = await weightBase(liquidity);

          // Estimate deposit given base
          const depositPreview = await adjustViewDeposit(
            "base",
            await previewDepositGivenBase(deposit, rateBase, tokenQuote, ratio, curve),
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

        it.only(`swapping amount: ${amt}`, async () => {
          await curve
            .originSwap(baseToken.address, TOKENS.USDC.address, amt, 0, await getFutureTime());
          const liquidity = await curve.liquidity();
          const ratio = await weightBase(liquidity);

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
            await previewDepositGivenBase(swapAmt, rateBase, tokenQuote, ratio, curve),
            swapAmt,
            TOKENS[tokenQuote].decimals,
            curve
          );

          // User input should be gte the estimate base
          expect(parseUnits(swapAmt.toString()).gte(depositPreviewGivenBase.base))

          const lpAmount = await curveLpToken.balanceOf(user1Address);
          const [baseAmt, quoteAmt] = await curve.connect(user1).viewWithdraw(lpAmount);
          expect(quoteAmt.lte(lpAmount)).to.be.true;

          const targetAmountInQuote = await curve
            .viewOriginSwap(baseToken.address, TOKENS.USDC.address, amt);
          expect(targetAmountInQuote.gt(0)).to.be.true;

          const originAmount = await curve
            .viewOriginSwap(baseToken.address, TOKENS.USDC.address, amt);
          expect(originAmount.gt(0)).to.be.true;
        });
      }
    });

    describe("pool deposit return balanced ratio", () => {
      maxSwap *= 10;

      for (let swapAmt = 1; swapAmt < maxSwap; swapAmt *= 5) {
        const amt = parseUnits(swapAmt.toString(), TOKENS.USDC.decimals);

        it.only(`swapping amount back ${amt}`, async () => {
          try {
            await curve
              .originSwap(TOKENS.USDC.address, baseToken.address, amt, 0, await getFutureTime());

            const liquidity = await curve.liquidity();
            const ratio = await weightBase(liquidity);

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
              await previewDepositGivenBase(swapAmt, rateBase, tokenQuote, ratio, curve),
              swapAmt,
              TOKENS[tokenQuote].decimals,
              curve
            );

            // User input should be gte the estimate base
            expect(parseUnits(swapAmt.toString()).gte(depositPreviewGivenBase.base))

            const lpAmount = await curveLpToken.balanceOf(user1Address);
            const [baseAmt, quoteAmt] = await curve.connect(user1).viewWithdraw(lpAmount);
            expect(quoteAmt.lte(lpAmount)).to.be.true;

            const targetAmountInQuote = await curve
              .viewOriginSwap(baseToken.address, TOKENS.USDC.address, amt);
            expect(targetAmountInQuote.gt(0)).to.be.true;

            const originAmount = await curve
              .viewOriginSwap(baseToken.address, TOKENS.USDC.address, amt);
            expect(originAmount.gt(0)).to.be.true;
          } catch (e) {
            expect(e.toString()).to.include("Curve/swap-convergence-failed");
          }
        });
      }
    });

    describe("pool withdraw", () => {
      for (let withdraw = 1; withdraw <= maxDeposit; withdraw *= 5) {
        const amt = parseUnits(withdraw.toString(), TOKENS.USDC.decimals);

        it.only(`withdraw amount: ${withdraw}`, async () => {
          try {
            let swapAmt = withdraw;
            await curve.connect(user1).withdraw(parseUnits(withdraw.toString()), await getFutureTime());

            const liquidity = await curve.liquidity();
            const ratio = await weightBase(liquidity);

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
              await previewDepositGivenBase(swapAmt, rateBase, tokenQuote, ratio, curve),
              swapAmt,
              TOKENS[tokenQuote].decimals,
              curve
            );

            // User input should be gte the estimate base
            expect(parseUnits(swapAmt.toString()).gte(depositPreviewGivenBase.base))

            const lpAmount = await curveLpToken.balanceOf(user1Address);
            const [baseAmt, quoteAmt] = await curve.connect(user1).viewWithdraw(lpAmount);
            expect(quoteAmt.lte(lpAmount)).to.be.true;

            const targetAmountInQuote = await curve
              .viewOriginSwap(baseToken.address, TOKENS.USDC.address, amt);
            expect(targetAmountInQuote.gt(0)).to.be.true;

            const originAmount = await curve
              .viewOriginSwap(baseToken.address, TOKENS.USDC.address, amt);
            expect(originAmount.gt(0)).to.be.true;
          } catch (e) {
            expect(e.toString()).to.include("insufficient balance");
          }
        });
      }
    });
  });
});