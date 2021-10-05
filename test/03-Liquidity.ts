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

import { getFutureTime, unlockAccountAndGetSigner } from "./Utils";
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

const previewDepositGivenBase = async (baseAmount: number, baseRate: number, key: string, baseWeight: number, curve: Curve) => {
  const baseNumeraire = baseAmount * baseRate
  const multiplier = key === "XSGD" ? 1 : baseWeight > 0 ? 1 / baseWeight : 2
  const totalNumeraire = parseUnits((baseNumeraire * multiplier).toString());
  const estimate = await curve.viewDeposit(totalNumeraire);

  let depositPreview = {
    deposit: totalNumeraire,
    lpToken: estimate[0],
    base: estimate[1][0],
    quote: estimate[1][1],
  }

  return depositPreview;
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

  describe("Deposit Liquidity: Base Amount Input", async () => {
    let totalPercent = 100;
    let maxDeposit = 5000000;

    for (const key in TOKENS) {
      if (key !== 'USDC') {
        for (let d = 10; d <= maxDeposit; d *= 50) {
          for (let i = 10; i < totalPercent; i += 10) {
            it(`${key}:USDC - Base Deposit Amount (${d}) - Ratio (${i}:${totalPercent - i})`, async () => {
              let baseAssimilator: string;
              let baseAssimilatorContract: Contract;

              switch (key) {
                case 'XSGD':
                  baseAssimilator = xsgdToUsdAssimilator.address;
                  baseAssimilatorContract = xsgdToUsdAssimilator;
                  break;
                case 'EURS':
                  baseAssimilator = eursToUsdAssimilator.address;
                  baseAssimilatorContract = eursToUsdAssimilator;
                  break;
                case 'CADC':
                  baseAssimilator = cadcToUsdAssimilator.address;
                  baseAssimilatorContract = cadcToUsdAssimilator;
                  break;
              }

              const NAME = `Token ${key}`;
              const SYMBOL = `${key}`;
              const baseToken = (await ethers.getContractAt("ERC20", TOKENS[key].address)) as ERC20;
              const quoteToken = (await ethers.getContractAt("ERC20", TOKENS.USDC.address)) as ERC20;

              const { curve } = await createCurveAndSetParams({
                name: NAME,
                symbol: SYMBOL,
                base: TOKENS[key].address,
                quote: TOKENS.USDC.address,
                baseWeight: parseUnits((i / 100).toString()),
                quoteWeight: parseUnits(((totalPercent - i) / 100).toString()),
                baseAssimilator,
                quoteAssimilator: usdcToUsdAssimilator.address,
                params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
              });

              // Approve Deposit
              await multiMintAndApprove([
                [TOKENS[key].address, user1, parseUnits("10000000", TOKENS[key].decimals), curve.address],
                [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
              ]);

              // Preview given base
              const rateBase = Number(formatUnits(await baseAssimilatorContract.getRate(), 8));
              const liquidity = await curve.liquidity();
              const liquidityTotal = parseFloat(formatUnits(liquidity.total_));
              const numeraireBase = parseFloat(formatUnits(liquidity.individual_[0]));
              const weightBase = numeraireBase / liquidityTotal;

              // Estimate deposit given base
              const depositPreview = await previewDepositGivenBase(d, rateBase, key, weightBase, curve);

              const result = await curve.viewDeposit(depositPreview.deposit);
              const viewLpt = result[0];
              const baseDeposit: BigNumber = result[1][0];
              const quoteDeposit: BigNumber = result[1][1];

              // Compare estimate and viewDeposit LPT
              expect(depositPreview.deposit.lte(viewLpt));
              // Compare estimate and viewDeposit base amount
              expect(depositPreview.base.lte(baseDeposit));

              const baseBalA: BigNumber = await baseToken.balanceOf(user1Address);
              const quoteBalA: BigNumber = await quoteToken.balanceOf(user1Address);

              // Deposit
              await curve.deposit(depositPreview.deposit, await getFutureTime());

              const baseBalB: BigNumber = await baseToken.balanceOf(user1Address);
              const quoteBalB: BigNumber = await quoteToken.balanceOf(user1Address);

              // Compare balance after deposit
              expect(baseBalA.sub(baseDeposit).gte(baseBalB)).to.be.true;
              expect(quoteBalA.sub(quoteDeposit).gte(quoteBalB)).to.be.true;
            });
          }
        }
      }
    }
  });
});