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

  describe("Ratio", async () => {
    let totalPercent = 100;

    for (let i = 10; i < totalPercent; i += 10) {
      it(`${i}:${totalPercent - i}`, async () => {
        const NAME = "Token XSGD";
        const SYMBOL = "XSGD";

        const { curve } = await createCurveAndSetParams({
          name: NAME,
          symbol: SYMBOL,
          base: TOKENS.XSGD.address,
          quote: TOKENS.USDC.address,
          baseWeight: parseUnits((i / 100).toString()),
          quoteWeight: parseUnits(((totalPercent - i) / 100).toString()),
          baseAssimilator: xsgdToUsdAssimilator.address,
          quoteAssimilator: usdcToUsdAssimilator.address,
          params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
        });

        // Approve Deposit
        await multiMintAndApprove([
          [TOKENS.XSGD.address, user1, parseUnits("10000000", TOKENS_CADC_DECIMALS), curve.address],
          [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS_USDC_DECIMALS), curve.address],
        ]);

        await curve.deposit(parseUnits("100"), await getFutureTime());
        const lpAmount = await curve.balanceOf(user1Address);
        console.log("lpAmount: ", formatUnits(lpAmount));

        const result = await curve.viewDeposit(parseUnits("100"));

        console.log("Total LP: ", Math.ceil(parseFloat(formatUnits(result[0]))));
        console.log("Base: ", formatUnits(result[1][0], 6));
        console.log("Quote: ", formatUnits(result[1][1], 6));
        console.log("Quote Rounded Up: ", Math.ceil(parseFloat(formatUnits(result[1][1], 6))));

        console.log("\r\r\r");
      });
    }
  });
});