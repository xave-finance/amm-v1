/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from "hardhat";
import { Signer, Contract, ContractFactory, BigNumber, BigNumberish } from "ethers";
import chai, { expect } from "chai";
import chaiBigNumber from "chai-bignumber";

import { CurveFactory } from "../typechain/CurveFactory";
import { Curve } from "../typechain/Curve";
import { ERC20 } from "../typechain/ERC20";
import { Router } from "../typechain/Router";

import { ORACLES, TOKENS } from "./Constants";
import { getFutureTime, updateOracleAnswer, expectBNAproxEq, expectBNEq, getOracleAnswer } from "./Utils";

import { scaffoldTest, scaffoldHelpers } from "./Setup";
import { formatUnits, namehash } from "ethers/lib/utils";
import { format } from "prettier";

chai.use(chaiBigNumber(BigNumber));

const { parseUnits } = ethers.utils;

const NAME = "DFX V1";
const SYMBOL = "DFX-V1";
const ALPHA = parseUnits("0.8");
const BETA = parseUnits("0.5");
const MAX = parseUnits("0.15");
const EPSILON = parseUnits("0.0004");
const LAMBDA = parseUnits("0.3");

describe("Curve", function () {
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

  let mintAndApprove: (tokenAddress: string, minter: Signer, amount: BigNumberish, recipient: string) => Promise<void>;
  let multiMintAndApprove: (requests: [string, Signer, BigNumberish, string][]) => Promise<void>;

  let rates: BigNumber[];
  const oracles = [ORACLES.CADC.address, ORACLES.XSGD.address, ORACLES.EURS.address];

  beforeEach(async () => {
    rates = await Promise.all(oracles.map(x => getOracleAnswer(x)));
  });

  afterEach(async () => {
    await Promise.all(rates.map((x, i) => updateOracleAnswer(oracles[i], x)));
  });

  before(async function () {
    ({
      users: [user1, user2],
      userAddresses: [user1Address, user2Address],
      usdcToUsdAssimilator,
      eursToUsdAssimilator,
      CurveFactory,
      RouterFactory,
      usdc,
      eurs,
      erc20,
    } = await scaffoldTest());
  });

  beforeEach(async function () {
    curveFactory = (await CurveFactory.deploy()) as CurveFactory;
    router = (await RouterFactory.deploy(curveFactory.address)) as Router;

    ({ createCurveAndSetParams, mintAndApprove, multiMintAndApprove } = await scaffoldHelpers({
      curveFactory,
      erc20,
    }));
  });

  describe("Pool Ratio changes between operations", function () {
    describe("viewDeposit", function () {
      const viewLPDepositWithSanityChecks = async ({
        amount,
        name,
        symbol,
        base,
        quote,
        baseWeight,
        quoteWeight,
        baseDecimals,
        quoteDecimals,
        baseAssimilator,
        quoteAssimilator,
        params,
        oracle,
      }: {
        name: string;
        symbol: string;
        amount: string;
        base: string;
        quote: string;
        baseWeight: BigNumberish;
        quoteWeight: BigNumberish;
        baseDecimals: number;
        quoteDecimals: number;
        baseAssimilator: string;
        quoteAssimilator: string;
        params: [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish];
        oracle: string;
      }) => {
        const { curve } = await createCurveAndSetParams({
          name,
          symbol,
          base,
          quote,
          baseWeight,
          quoteWeight,
          baseAssimilator,
          quoteAssimilator,
          params,
        });

        // Mint tokens and approve
        await multiMintAndApprove([
          [base, user1, parseUnits("10000000", baseDecimals), curve.address],
          [quote, user1, parseUnits("10000000", quoteDecimals), curve.address],
          [base, user2, parseUnits(amount, baseDecimals), curve.address],
          [quote, user2, parseUnits(amount, quoteDecimals), curve.address],
        ]);

        const depositAmount = parseUnits("1000000");

        // Make sure initial amount is the oracle value
        const ORACLE_RATE = await getOracleAnswer(oracle);

        const [lpAmountUser1, [baseViewUser1, quoteViewUser1]] = await curve.viewDeposit(depositAmount);

        const expectedDepositAmountBase = parseUnits(formatUnits(depositAmount), baseDecimals)
          .mul(1e8)
          .div(ORACLE_RATE)
          .div(2);
        const expectedDepositAmountQuote = parseUnits(formatUnits(depositAmount), quoteDecimals).div(2);

        console.log('----------------------------------------------');
        console.log('depositAmount', depositAmount);
        console.log('lpAmountUser1', lpAmountUser1);
        console.log('baseViewUser1', baseViewUser1);
        console.log('quoteViewUser1', quoteViewUser1);
        console.log('----------------------------------------------');

        // expectBNAproxEq(baseViewUser1, expectedDepositAmountBase, expectedDepositAmountBase.div(2000));
        // expectBNAproxEq(quoteViewUser1, expectedDepositAmountQuote, expectedDepositAmountQuote.div(2000));

        // // Deposit user 1
        // await curve
        //   .connect(user1)
        //   .deposit(depositAmount, await getFutureTime())
        //   .then(x => x.wait());
      };

      const eurAmt = "1";
      it(`EURS/USDC 50/50`, async function () {
        await viewLPDepositWithSanityChecks({
          amount: eurAmt.toString(),
          name: NAME,
          symbol: SYMBOL,
          base: eurs.address,
          quote: usdc.address,
          baseWeight: parseUnits("0.5"),
          quoteWeight: parseUnits("0.5"),
          baseDecimals: 2,
          quoteDecimals: TOKENS.USDC.decimals,
          baseAssimilator: eursToUsdAssimilator.address,
          quoteAssimilator: usdcToUsdAssimilator.address,
          params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
          oracle: "0xb49f677943BC038e9857d61E7d053CaA2C1734C1",
        });
      });
    });
  });
});
