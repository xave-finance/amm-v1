/* eslint-disable @typescript-eslint/no-unused-vars */
import path from "path";
import { ethers } from "hardhat";
import { Signer, Contract, ContractFactory, BigNumber, BigNumberish } from "ethers";
import chai from "chai";
import chaiBigNumber from "chai-bignumber";

import { CurveFactory } from "../typechain/CurveFactory";
import { Curve } from "../typechain/Curve";
import { ERC20 } from "../typechain/ERC20";
import { Router } from "../typechain/Router";

const { ORACLES, TOKENS } = require(path.resolve(__dirname, `tokens/${process.env.NETWORK}/Constants.ts`));
import { getFutureTime, expectBNAproxEq, getOracleAnswer } from "../test/Utils";

import { scaffoldTest, scaffoldHelpers } from "../test/Setup";

chai.use(chaiBigNumber(BigNumber));

const { parseUnits } = ethers.utils;

const NAME = "DFX V1";
const SYMBOL = "DFX-V1";
import { CONFIG } from "../test/Config";
const DIMENSION = {
  alpha: parseUnits(CONFIG.DIMENSION_ALPHA),
  beta: parseUnits(CONFIG.DIMENSION_BETA),
  max: parseUnits(CONFIG.DIMENSION_MAX),
  epsilon: parseUnits(CONFIG.DIMENSION_EPSILON),
  lambda: parseUnits(CONFIG.DIMENSION_LAMBDA)
}

describe("Router", function () {
  let [user1, user2]: Signer[] = [];
  let [user1Address, user2Address]: string[] = [];

  let assimilator = {};
  let quoteAssimilatorAddr;

  let cadcToUsdAssimilator: Contract;
  let usdcToUsdAssimilator: Contract;
  let eursToUsdAssimilator: Contract;
  let xsgdToUsdAssimilator: Contract;
  let fxphpToUsdAssimilator: Contract;

  let CurveFactory: ContractFactory;
  let RouterFactory: ContractFactory;

  let curveFactory: CurveFactory;
  let router: Router;

  let usdc: ERC20;
  let cadc: ERC20;
  let eurs: ERC20;
  let xsgd: ERC20;
  let fxphp: ERC20;
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

  before(async function () {
    ({
      users: [user1, user2],
      userAddresses: [user1Address, user2Address],

      usdcToUsdAssimilator,
      eursToUsdAssimilator,
      xsgdToUsdAssimilator,
      cadcToUsdAssimilator,
      fxphpToUsdAssimilator,

      usdc,
      eurs,
      xsgd,
      fxphp,
      erc20,

      CurveFactory,
      RouterFactory,
    } = await scaffoldTest());

    assimilator = {
      'EURS': eursToUsdAssimilator,
      'XSGD': xsgdToUsdAssimilator,
      'CADC': cadcToUsdAssimilator,
      'FXPHP': fxphpToUsdAssimilator,
    };

    quoteAssimilatorAddr = require(path.resolve(__dirname, `../scripts/config/usdcassimilator/${process.env.NETWORK}.json`));
  });

  beforeEach(async function () {
    curveFactory = (await CurveFactory.deploy()) as CurveFactory;
    router = (await RouterFactory.deploy(curveFactory.address)) as Router;

    ({ createCurveAndSetParams, mintAndApprove, multiMintAndApprove } = await scaffoldHelpers({
      curveFactory,
      erc20,
    }));
  });
  beforeEach(async function () {
    const { curve: curveEURS } = await createCurveAndSetParams({
      name: NAME,
      symbol: SYMBOL,
      base: TOKENS.EURS.address,
      quote: TOKENS.USDC.address,
      baseWeight: parseUnits("0.4"),
      quoteWeight: parseUnits("0.6"),
      baseAssimilator: assimilator["EURS"].address,
      quoteAssimilator: quoteAssimilatorAddr.address,
      params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
    });

    const { curve: curveXSGD } = await createCurveAndSetParams({
      name: NAME,
      symbol: SYMBOL,
      base: TOKENS.XSGD.address,
      quote: TOKENS.USDC.address,
      baseWeight: parseUnits("0.4"),
      quoteWeight: parseUnits("0.6"),
      baseAssimilator: assimilator["XSGD"].address,
      quoteAssimilator: quoteAssimilatorAddr.address,
      params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
    });

    const { curve: curveCADC } = await createCurveAndSetParams({
      name: NAME,
      symbol: SYMBOL,
      base: TOKENS.CADC.address,
      quote: TOKENS.USDC.address,
      baseWeight: parseUnits("0.4"),
      quoteWeight: parseUnits("0.6"),
      baseAssimilator: assimilator["CADC"].address,
      quoteAssimilator: quoteAssimilatorAddr.address,
      params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
    });

    const { curve: curveFXPHP } = await createCurveAndSetParams({
      name: NAME,
      symbol: SYMBOL,
      base: TOKENS.FXPHP.address,
      quote: TOKENS.USDC.address,
      baseWeight: parseUnits("0.4"),
      quoteWeight: parseUnits("0.6"),
      baseAssimilator: assimilator["FXPHP"].address,
      quoteAssimilator: quoteAssimilatorAddr.address,
      params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
    });

    // Supply liquidity to the pools
    // Mint tokens and approve
    await multiMintAndApprove([
      [TOKENS.USDC.address, user1, parseUnits("100000", TOKENS.USDC.decimals), curveEURS.address],
      [TOKENS.EURS.address, user1, parseUnits("100000", TOKENS.EURS.decimals), curveEURS.address],
      [TOKENS.USDC.address, user1, parseUnits("100000", TOKENS.USDC.decimals), curveXSGD.address],
      [TOKENS.XSGD.address, user1, parseUnits("100000", TOKENS.XSGD.decimals), curveXSGD.address],
      [TOKENS.USDC.address, user1, parseUnits("100000", TOKENS.USDC.decimals), curveCADC.address],
      [TOKENS.CADC.address, user1, parseUnits("100000", TOKENS.CADC.decimals), curveCADC.address],
      [TOKENS.USDC.address, user1, parseUnits("10000000", TOKENS.USDC.decimals), curveFXPHP.address],
      [TOKENS.FXPHP.address, user1, parseUnits("10000000", TOKENS.FXPHP.decimals), curveFXPHP.address],
    ]);

    await curveEURS
      .connect(user1)
      .deposit(parseUnits("50000"), await getFutureTime())
      .then(x => x.wait());
    await curveXSGD
      .connect(user1)
      .deposit(parseUnits("50000"), await getFutureTime())
      .then(x => x.wait());
    await curveCADC
      .connect(user1)
      .deposit(parseUnits("50000"), await getFutureTime())
      .then(x => x.wait());
    await curveFXPHP
      .connect(user1)
      .deposit(parseUnits("50000"), await getFutureTime())
      .then(x => x.wait());
  });

  const routerOriginSwapAndCheck = async ({
    user,
    fromToken,
    toToken,
    amount,
    fromOracle,
    toOracle,
    fromDecimals,
    toDecimals,
  }: {
    user: Signer;
    fromToken: string;
    toToken: string;
    amount: BigNumber;
    fromOracle: string;
    toOracle: string;
    fromDecimals: number;
    toDecimals: number;
  }) => {
    const userAddress = await user.getAddress();
    await mintAndApprove(fromToken, user, amount, router.address);
    const beforeAmnt = await erc20.attach(toToken).balanceOf(userAddress);

    const viewExpected = await router.connect(user).viewOriginSwap(TOKENS.USDC.address, fromToken, toToken, amount);

    await router.connect(user).originSwap(TOKENS.USDC.address, fromToken, toToken, amount, 0, await getFutureTime());
    const afterAmnt = await erc20.attach(toToken).balanceOf(userAddress);

    // Get oracle rates
    const FROM_RATE8 = await getOracleAnswer(fromOracle);
    const TO_RATE8 = await getOracleAnswer(toOracle);

    const obtained = afterAmnt.sub(beforeAmnt);
    let expected = amount.mul(FROM_RATE8).div(TO_RATE8);

    if (fromDecimals - toDecimals < 0) {
      expected = expected.mul(parseUnits("1", toDecimals - fromDecimals));
    } else {
      expected = expected.div(parseUnits("1", fromDecimals - toDecimals));
    }

    expectBNAproxEq(obtained, expected, parseUnits("200", toDecimals));
    expectBNAproxEq(obtained, viewExpected, parseUnits("1", toDecimals));
  };

  const routerViewTargetSwapAndCheck = async ({
    fromSymbol,
    toSymbol,
    user,
    fromToken,
    toToken,
    targetAmount,
    fromOracle,
    toOracle,
    fromDecimals,
    toDecimals,
  }: {
    fromSymbol: string;
    toSymbol: string;
    user: Signer;
    fromToken: string;
    toToken: string;
    targetAmount: BigNumber;
    fromOracle: string;
    toOracle: string;
    fromDecimals: number;
    toDecimals: number;
  }) => {
    // Get oracle rates
    const FROM_RATE8 = await getOracleAnswer(fromOracle);
    const TO_RATE8 = await getOracleAnswer(toOracle);

    const sent = await router.connect(user).viewTargetSwap(TOKENS.USDC.address, fromToken, toToken, targetAmount);

    let expected = targetAmount.mul(TO_RATE8).div(FROM_RATE8);

    if (toDecimals - fromDecimals < 0) {
      expected = expected.mul(parseUnits("1", fromDecimals - toDecimals));
    } else {
      expected = expected.div(parseUnits("1", toDecimals - fromDecimals));
    }

    const delta = fromSymbol === "FXPHP" || toSymbol === "FXPHP" ? parseUnits("1000", fromDecimals) : parseUnits("2", fromDecimals);

    expectBNAproxEq(sent, expected, delta);
  };

  it("EURS -> XSGD targetSwap", async function () {
    await routerViewTargetSwapAndCheck({
      fromSymbol: "EURS",
      toSymbol: "XSGD",
      user: user2,
      fromToken: TOKENS.EURS.address,
      toToken: TOKENS.XSGD.address,
      targetAmount: parseUnits("900", TOKENS.EURS.decimals),
      fromOracle: ORACLES.EUR.address,
      toOracle: ORACLES.SGD.address,
      fromDecimals: TOKENS.EURS.decimals,
      toDecimals: TOKENS.XSGD.decimals,
    });
  });

  it("EURS -> CADC targetSwap", async function () {
    await routerViewTargetSwapAndCheck({
      fromSymbol: "EURS",
      toSymbol: "CADC",
      user: user2,
      fromToken: TOKENS.EURS.address,
      toToken: TOKENS.CADC.address,
      targetAmount: parseUnits("900", TOKENS.EURS.decimals),
      fromOracle: ORACLES.EUR.address,
      toOracle: ORACLES.CAD.address,
      fromDecimals: TOKENS.EURS.decimals,
      toDecimals: TOKENS.CADC.decimals,
    });
  });

  it("XSGD -> EURS targetSwap", async function () {
    await routerViewTargetSwapAndCheck({
      fromSymbol: "XSGD",
      toSymbol: "EURS",
      user: user2,
      fromToken: TOKENS.XSGD.address,
      toToken: TOKENS.EURS.address,
      targetAmount: parseUnits("900", TOKENS.EURS.decimals),
      fromOracle: ORACLES.SGD.address,
      toOracle: ORACLES.EUR.address,
      fromDecimals: TOKENS.XSGD.decimals,
      toDecimals: TOKENS.EURS.decimals,
    });
  });

  it("XSGD -> CADC targetSwap", async function () {
    await routerViewTargetSwapAndCheck({
      fromSymbol: "XSGD",
      toSymbol: "CADC",
      user: user2,
      fromToken: TOKENS.XSGD.address,
      toToken: TOKENS.CADC.address,
      targetAmount: parseUnits("900", TOKENS.XSGD.decimals),
      fromOracle: ORACLES.SGD.address,
      toOracle: ORACLES.CAD.address,
      fromDecimals: TOKENS.XSGD.decimals,
      toDecimals: TOKENS.CADC.decimals,
    });
  });

  it("CADC -> USDC targetSwap", async function () {
    await routerViewTargetSwapAndCheck({
      fromSymbol: "CADC",
      toSymbol: "USDC",
      user: user2,
      fromToken: TOKENS.CADC.address,
      toToken: TOKENS.USDC.address,
      targetAmount: parseUnits("900", TOKENS.USDC.decimals),
      fromOracle: ORACLES.CAD.address,
      toOracle: ORACLES.USDC.address,
      fromDecimals: TOKENS.CADC.decimals,
      toDecimals: TOKENS.USDC.decimals,
    });
  });

  it("CADC -> XSGD targetSwap", async function () {
    await routerViewTargetSwapAndCheck({
      fromSymbol: "CADC",
      toSymbol: "XSGD",
      user: user2,
      fromToken: TOKENS.CADC.address,
      toToken: TOKENS.XSGD.address,
      targetAmount: parseUnits("900", TOKENS.XSGD.decimals),
      fromOracle: ORACLES.CAD.address,
      toOracle: ORACLES.SGD.address,
      fromDecimals: TOKENS.CADC.decimals,
      toDecimals: TOKENS.XSGD.decimals,
    });
  });

  it("CADC -> EURS targetSwap", async function () {
    await routerViewTargetSwapAndCheck({
      fromSymbol: "CADC",
      toSymbol: "EURS",
      user: user2,
      fromToken: TOKENS.CADC.address,
      toToken: TOKENS.EURS.address,
      targetAmount: parseUnits("900", TOKENS.EURS.decimals),
      fromOracle: ORACLES.CAD.address,
      toOracle: ORACLES.EUR.address,
      fromDecimals: TOKENS.CADC.decimals,
      toDecimals: TOKENS.EURS.decimals,
    });
  });

  it("USDC -> CADC targetSwap", async function () {
    await routerViewTargetSwapAndCheck({
      fromSymbol: "USDC",
      toSymbol: "CADC",
      user: user2,
      fromToken: TOKENS.USDC.address,
      toToken: TOKENS.CADC.address,
      targetAmount: parseUnits("900", TOKENS.USDC.decimals),
      fromOracle: ORACLES.USDC.address,
      toOracle: ORACLES.CAD.address,
      fromDecimals: TOKENS.USDC.decimals,
      toDecimals: TOKENS.CADC.decimals,
    });
  });

  it("FXPHP -> EURS targetSwap", async function () {
    await routerViewTargetSwapAndCheck({
      fromSymbol: "FXPHP",
      toSymbol: "EURS",
      user: user2,
      fromToken: TOKENS.FXPHP.address,
      toToken: TOKENS.EURS.address,
      targetAmount: parseUnits("900", TOKENS.EURS.decimals),
      fromOracle: ORACLES.PHP.address,
      toOracle: ORACLES.EUR.address,
      fromDecimals: TOKENS.FXPHP.decimals,
      toDecimals: TOKENS.EURS.decimals,
    });
  });

  it("FXPHP -> XSGD targetSwap", async function () {
    await routerViewTargetSwapAndCheck({
      fromSymbol: "FXPHP",
      toSymbol: "XSGD",
      user: user2,
      fromToken: TOKENS.FXPHP.address,
      toToken: TOKENS.XSGD.address,
      targetAmount: parseUnits("900", TOKENS.XSGD.decimals),
      fromOracle: ORACLES.PHP.address,
      toOracle: ORACLES.SGD.address,
      fromDecimals: TOKENS.FXPHP.decimals,
      toDecimals: TOKENS.XSGD.decimals,
    });
  });

  it("FXPHP -> CADC targetSwap", async function () {
    await routerViewTargetSwapAndCheck({
      fromSymbol: "FXPHP",
      toSymbol: "CADC",
      user: user2,
      fromToken: TOKENS.FXPHP.address,
      toToken: TOKENS.CADC.address,
      targetAmount: parseUnits("900", TOKENS.CADC.decimals),
      fromOracle: ORACLES.PHP.address,
      toOracle: ORACLES.CAD.address,
      fromDecimals: TOKENS.FXPHP.decimals,
      toDecimals: TOKENS.CADC.decimals,
    });
  });

  it("FXPHP -> USDC targetSwap", async function () {
    await routerViewTargetSwapAndCheck({
      fromSymbol: "FXPHP",
      toSymbol: "USDC",
      user: user2,
      fromToken: TOKENS.FXPHP.address,
      toToken: TOKENS.USDC.address,
      targetAmount: parseUnits("900", TOKENS.USDC.decimals),
      fromOracle: ORACLES.PHP.address,
      toOracle: ORACLES.USDC.address,
      fromDecimals: TOKENS.FXPHP.decimals,
      toDecimals: TOKENS.USDC.decimals,
    });
  });

  it("EURS -> XSGD originSwap", async function () {
    await routerOriginSwapAndCheck({
      user: user2,
      fromToken: TOKENS.EURS.address,
      toToken: TOKENS.XSGD.address,
      amount: parseUnits("1000", TOKENS.EURS.decimals),
      fromOracle: ORACLES.EUR.address,
      toOracle: ORACLES.SGD.address,
      fromDecimals: TOKENS.EURS.decimals,
      toDecimals: TOKENS.XSGD.decimals,
    });
  });

  it("EURS -> CADC originSwap", async function () {
    await routerOriginSwapAndCheck({
      user: user2,
      fromToken: TOKENS.EURS.address,
      toToken: TOKENS.CADC.address,
      amount: parseUnits("1000", TOKENS.EURS.decimals),
      fromOracle: ORACLES.EUR.address,
      toOracle: ORACLES.CAD.address,
      fromDecimals: TOKENS.EURS.decimals,
      toDecimals: TOKENS.CADC.decimals,
    });
  });

  it("XSGD -> EURS originSwap", async function () {
    await routerOriginSwapAndCheck({
      user: user2,
      fromToken: TOKENS.XSGD.address,
      toToken: TOKENS.EURS.address,
      amount: parseUnits("100", TOKENS.XSGD.decimals),
      fromOracle: ORACLES.SGD.address,
      toOracle: ORACLES.EUR.address,
      fromDecimals: TOKENS.XSGD.decimals,
      toDecimals: TOKENS.EURS.decimals,
    });
  });

  it("XSGD -> CADC originSwap", async function () {
    await routerOriginSwapAndCheck({
      user: user2,
      fromToken: TOKENS.XSGD.address,
      toToken: TOKENS.CADC.address,
      amount: parseUnits("1000", TOKENS.XSGD.decimals),
      fromOracle: ORACLES.SGD.address,
      toOracle: ORACLES.CAD.address,
      fromDecimals: TOKENS.XSGD.decimals,
      toDecimals: TOKENS.CADC.decimals,
    });
  });

  it("CADC -> USDC originSwap", async function () {
    await routerOriginSwapAndCheck({
      user: user2,
      fromToken: TOKENS.CADC.address,
      toToken: TOKENS.USDC.address,
      amount: parseUnits("1000", TOKENS.CADC.decimals),
      fromOracle: ORACLES.CAD.address,
      toOracle: ORACLES.USDC.address,
      fromDecimals: TOKENS.CADC.decimals,
      toDecimals: TOKENS.USDC.decimals,
    });
  });

  it("CADC -> XSGD originSwap", async function () {
    await routerOriginSwapAndCheck({
      user: user2,
      fromToken: TOKENS.CADC.address,
      toToken: TOKENS.XSGD.address,
      amount: parseUnits("1000", TOKENS.CADC.decimals),
      fromOracle: ORACLES.CAD.address,
      toOracle: ORACLES.SGD.address,
      fromDecimals: TOKENS.CADC.decimals,
      toDecimals: TOKENS.XSGD.decimals,
    });
  });

  it("CADC -> EURS originSwap", async function () {
    await routerOriginSwapAndCheck({
      user: user2,
      fromToken: TOKENS.CADC.address,
      toToken: TOKENS.EURS.address,
      amount: parseUnits("1000", TOKENS.CADC.decimals),
      fromOracle: ORACLES.CAD.address,
      toOracle: ORACLES.EUR.address,
      fromDecimals: TOKENS.CADC.decimals,
      toDecimals: TOKENS.EURS.decimals,
    });
  });

  it("USDC -> XSGD originSwap", async function () {
    await routerOriginSwapAndCheck({
      user: user2,
      fromToken: TOKENS.USDC.address,
      toToken: TOKENS.XSGD.address,
      amount: parseUnits("1000", TOKENS.USDC.decimals),
      fromOracle: ORACLES.USDC.address,
      toOracle: ORACLES.SGD.address,
      fromDecimals: TOKENS.USDC.decimals,
      toDecimals: TOKENS.XSGD.decimals,
    });
  });

  it("FXPHP -> EURS originSwap", async function () {
    await routerOriginSwapAndCheck({
      user: user2,
      fromToken: TOKENS.FXPHP.address,
      toToken: TOKENS.EURS.address,
      amount: parseUnits("1000", TOKENS.FXPHP.decimals),
      fromOracle: ORACLES.PHP.address,
      toOracle: ORACLES.EUR.address,
      fromDecimals: TOKENS.FXPHP.decimals,
      toDecimals: TOKENS.EURS.decimals,
    });
  });

  it("FXPHP -> XSGD originSwap", async function () {
    await routerOriginSwapAndCheck({
      user: user2,
      fromToken: TOKENS.FXPHP.address,
      toToken: TOKENS.XSGD.address,
      amount: parseUnits("1000", TOKENS.FXPHP.decimals),
      fromOracle: ORACLES.PHP.address,
      toOracle: ORACLES.SGD.address,
      fromDecimals: TOKENS.FXPHP.decimals,
      toDecimals: TOKENS.XSGD.decimals,
    });
  });

  it("FXPHP -> CADC originSwap", async function () {
    await routerOriginSwapAndCheck({
      user: user2,
      fromToken: TOKENS.FXPHP.address,
      toToken: TOKENS.CADC.address,
      amount: parseUnits("1000", TOKENS.FXPHP.decimals),
      fromOracle: ORACLES.PHP.address,
      toOracle: ORACLES.CAD.address,
      fromDecimals: TOKENS.FXPHP.decimals,
      toDecimals: TOKENS.CADC.decimals,
    });
  });

  it("FXPHP -> USDC originSwap", async function () {
    await routerOriginSwapAndCheck({
      user: user2,
      fromToken: TOKENS.FXPHP.address,
      toToken: TOKENS.USDC.address,
      amount: parseUnits("1000", TOKENS.FXPHP.decimals),
      fromOracle: ORACLES.PHP.address,
      toOracle: ORACLES.USDC.address,
      fromDecimals: TOKENS.FXPHP.decimals,
      toDecimals: TOKENS.USDC.decimals,
    });
  });
});