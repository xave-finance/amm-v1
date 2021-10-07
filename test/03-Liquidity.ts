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
    before(async () => {
      const NAME = `Token XSGD`;
      const SYMBOL = `XSGD`;
      baseToken = (await ethers.getContractAt("ERC20", TOKENS.XSGD.address)) as ERC20;
      quoteToken = (await ethers.getContractAt("ERC20", TOKENS.USDC.address)) as ERC20;

      ({ curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.XSGD.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits(".5"),
        quoteWeight: parseUnits(".5"),
        baseAssimilator: xsgdToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      }));

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.XSGD.address, user1, parseUnits("900000000", TOKENS.XSGD.decimals), curve.address],
        [TOKENS.USDC.address, user1, parseUnits("900000000", TOKENS.USDC.decimals), curve.address],
      ]);
    });

    describe("given quote as input", () => {
      for (let deposit = 1; deposit <= maxDeposit; deposit *= 10) {
        it(`it returns estimated quote similar to input quote: ${deposit}`, async () => {
          // Estimate deposit given quote
          const depositPreview = await adjustViewDeposit(
            "quote",
            await previewDepositGivenQuote(deposit, "XSGD", curve),
            deposit,
            TOKENS.USDC.decimals,
            curve
          );

          console.log("Estimate Quote: ", formatUnits(depositPreview.quote, TOKENS.USDC.decimals));

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
      for (let deposit = 1; deposit <= maxDeposit; deposit *= 10) {
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
            await previewDepositGivenBase(deposit, rateBase, "XSGD", weightBase, curve),
            deposit,
            TOKENS.XSGD.decimals,
            curve
          );

          console.log("Estimate Base: ", formatUnits(depositPreview.base, TOKENS.XSGD.decimals));

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
  });

  describe("viewDeposit on EURS/USDC curve", () => {
    before(async () => {
      const NAME = `Token EURS`;
      const SYMBOL = `EURS`;
      baseToken = (await ethers.getContractAt("ERC20", TOKENS.EURS.address)) as ERC20;
      quoteToken = (await ethers.getContractAt("ERC20", TOKENS.USDC.address)) as ERC20;

      ({ curve } = await createCurveAndSetParams({
        name: NAME,
        symbol: SYMBOL,
        base: TOKENS.EURS.address,
        quote: TOKENS.USDC.address,
        baseWeight: parseUnits(".5"),
        quoteWeight: parseUnits(".5"),
        baseAssimilator: eursToUsdAssimilator.address,
        quoteAssimilator: usdcToUsdAssimilator.address,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      }));

      // Approve Deposit
      await multiMintAndApprove([
        [TOKENS.EURS.address, user1, parseUnits("900000000", TOKENS.EURS.decimals), curve.address],
        [TOKENS.USDC.address, user1, parseUnits("900000000", TOKENS.USDC.decimals), curve.address],
      ]);
    });

    describe("given quote as input", () => {
      for (let deposit = 1; deposit <= maxDeposit; deposit *= 10) {
        it(`it returns estimated quote similar to input quote: ${deposit}`, async () => {
          // Estimate deposit given quote
          const depositPreview = await adjustViewDeposit(
            "quote",
            await previewDepositGivenQuote(deposit, "EURS", curve),
            deposit,
            TOKENS.USDC.decimals,
            curve
          );

          console.log("Estimate Quote: ", formatUnits(depositPreview.quote, TOKENS.USDC.decimals));

          // User input should be gte the estimate quote
          expect(parseUnits(deposit.toString()).gte(depositPreview.quote))

          const baseBalA: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalA: BigNumber = await quoteToken.balanceOf(user1Address);

          // Deposit
          await curve.deposit(parseUnits((depositPreview.deposit).toString()), await getFutureTime());

          const baseBalB: BigNumber = await baseToken.balanceOf(user1Address);
          const quoteBalB: BigNumber = await quoteToken.balanceOf(user1Address);

          // Compare balance before and after deposit
          expect(baseBalA.sub(depositPreview.base).gte(baseBalB)).to.be.true;
          expect(quoteBalA.sub(depositPreview.quote).gte(quoteBalB)).to.be.true;
        });
      }
    });

    describe("given base as input", () => {
      for (let deposit = 1; deposit <= maxDeposit; deposit *= 10) {
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
            await previewDepositGivenBase(deposit, rateBase, "EURS", weightBase, curve),
            deposit,
            TOKENS.EURS.decimals,
            curve
          );

          console.log("Estimate Base: ", formatUnits(depositPreview.base, TOKENS.EURS.decimals));

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
  });
});