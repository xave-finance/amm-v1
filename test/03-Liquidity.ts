/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from "hardhat";
import { Signer, Contract, ContractFactory, BigNumber, BigNumberish } from "ethers";
import chai, { expect } from "chai";
import chaiBigNumber from "chai-bignumber";

import { CurveFactory } from "../typechain/CurveFactory";
import { Curve } from "../typechain/Curve";
import { ERC20 } from "../typechain/ERC20";
import { Router } from "../typechain/Router";

import { scaffoldTest, scaffoldHelpers, scaffoldMockTokens } from "./Setup";
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

describe("Curve Contract", async () => {
  let [user1, user2]: Signer[] = [];
  let [user1Address, user2Address]: string[] = [];

  let cadcToUsdAssimilator: Contract;
  let usdcToUsdAssimilator: Contract;
  let eursToUsdAssimilator: Contract;
  let xsgdToUsdAssimilator: Contract;
  let tgbpAssimilator: Contract;

  let CurveFactory: ContractFactory;
  let RouterFactory: ContractFactory;

  let curveFactory: CurveFactory;
  let router: Router;

  let usdc: ERC20;
  let cadc: ERC20;
  let eurs: ERC20;
  let xsgd: ERC20;
  let tgbp: ERC20;
  let taud: ERC20;
  let erc20: ERC20;

  let tokens: any;
  let assimilators: any;

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

  function makeSuite(name, tests) {
    describe(name, function () {
      beforeEach(async () => {
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

        ({ tokens, assimilators } = await scaffoldMockTokens());
      });
      tests();
    });
  }

  makeSuite('Deposit Liquidity', function () {
    it('', function (done) {
      let totalPercent = 100;
      let maxDeposit = 500;

      for (const key in tokens) {
        if (key !== 'USDC') {
          for (let d = 10; d <= maxDeposit; d *= 50) {
            for (let i = 10; i < totalPercent; i += 10) {
              describe("", async () => {
                it(`${key}:USDC - Ratio (${i}:${totalPercent - i}) - Deposit (${d})`, async () => {
                  let baseAssimilator: string;

                  switch (key) {
                    case 'XSGD':
                      baseAssimilator = xsgdToUsdAssimilator.address;
                      break;
                    case 'EURS':
                      baseAssimilator = eursToUsdAssimilator.address;
                      break;
                    case 'CADC':
                      baseAssimilator = cadcToUsdAssimilator.address;
                      break;
                    case 'TGBP':
                      baseAssimilator = assimilators.tgbp;
                      break;
                    case 'TAUD':
                      baseAssimilator = assimilators.taud;
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

                  // // Approve Deposit
                  // await multiMintAndApprove([
                  //   [TOKENS[key].address, user1, parseUnits("10000000", TOKENS[key].decimals), curve.address],
                  //   [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curve.address],
                  // ]);

                  // const amt = parseUnits(d.toString());
                  // const result = await curve.viewDeposit(amt);
                  // const baseDeposit: BigNumber = result[1][0];
                  // const quoteDeposit: BigNumber = result[1][1];
                  // const baseBalA: BigNumber = await baseToken.balanceOf(user1Address);
                  // const quoteBalA: BigNumber = await quoteToken.balanceOf(user1Address);

                  // await curve.deposit(amt, await getFutureTime());

                  // const baseBalB: BigNumber = await baseToken.balanceOf(user1Address);
                  // const quoteBalB: BigNumber = await quoteToken.balanceOf(user1Address);

                  // expect(baseBalA.sub(baseDeposit).gte(baseBalB)).to.be.true;
                  // expect(quoteBalA.sub(quoteDeposit).gte(quoteBalB)).to.be.true;
                });
              });
            }
          }
        }
      }
      done();
    });
  });
});