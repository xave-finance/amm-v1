/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from "hardhat";
import { Signer, Contract, ContractFactory, BigNumber, BigNumberish } from "ethers";
import chai, { expect } from "chai";
import chaiBigNumber from "chai-bignumber";

import { Zap, Curve, CurveFactory, ERC20, Router } from "../../typechain";

import { ORACLES, TOKENS } from "../Constants";
import {
  getFutureTime,
  updateOracleAnswer,
  expectBNAproxEq,
  expectBNEq,
  getOracleAnswer,
  snapshotAndRevert,
  unlockAccountAndGetSigner,
} from "../Utils";

import { formatUnits, namehash, parseUnits } from "ethers/lib/utils";
import { format } from "prettier";
import { scaffoldHelpers, scaffoldTest } from "../Setup";

chai.use(chaiBigNumber(BigNumber));

describe("Zap", function () {
  let [user, user2]: Signer[] = [];
  let [userAddress, user2Address]: string[] = [];
  let multiMintAndApprove: (requests: [string, Signer, BigNumberish, string][]) => Promise<void>;

  let curveCADC: Curve;
  let curveEURS: Curve;
  let curveXSGD: Curve;

  let router: Router;

  let usdc: ERC20;
  let cadc: ERC20;
  let eurs: ERC20;
  let xsgd: ERC20;
  let erc20: ERC20;

  let zap: Zap;

  before(async function () {
    [user, user2] = await ethers.getSigners();
    [userAddress, user2Address] = await Promise.all([user, user2].map(x => x.getAddress()));

    erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;
    ({ multiMintAndApprove } = await scaffoldHelpers({
      curveFactory: null as CurveFactory,
      erc20,
    }));

    curveCADC = (await ethers.getContractAt(
      "./contracts/Curve.sol:Curve",
      "0xa6c0cbcaebd93ad3c6c94412ec06aaa37870216d",
    )) as Curve;
    curveEURS = (await ethers.getContractAt(
      "./contracts/Curve.sol:Curve",
      "0x1a4Ffe0DCbDB4d551cfcA61A5626aFD190731347",
    )) as Curve;
    curveXSGD = (await ethers.getContractAt(
      "./contracts/Curve.sol:Curve",
      "0x2baB29a12a9527a179Da88F422cDaaA223A90bD5",
    )) as Curve;

    const owner = await unlockAccountAndGetSigner(await curveCADC.owner());

    await curveCADC.connect(owner).turnOffWhitelisting({ gasPrice: 0 });
    await curveEURS.connect(owner).turnOffWhitelisting({ gasPrice: 0 });
    await curveXSGD.connect(owner).turnOffWhitelisting({ gasPrice: 0 });

    const Factory = await ethers.getContractFactory("Zap");
    zap = (await Factory.deploy()) as Zap;
  });

  const testZapFunctionality = async (base, quote, baseDecimals, quoteDecimals, curve: Curve, oracle) => {
    await multiMintAndApprove([
      [base, user, parseUnits("100000", baseDecimals), zap.address],
      [quote, user, parseUnits("100000", quoteDecimals), zap.address],
      [base, user, parseUnits("100000", baseDecimals), curve.address],
      [quote, user, parseUnits("100000", quoteDecimals), curve.address],
    ]);

    if (baseDecimals === 2) {
      await zap.zapFromQuote(curve.address, parseUnits("1", quoteDecimals), await getFutureTime(), 0);
      await zap.zapFromBase(curve.address, parseUnits("1", baseDecimals), await getFutureTime(), 0);
    } else {
      await zap.zapFromQuote(curve.address, parseUnits("1", quoteDecimals), await getFutureTime(), 0);
      await zap.zapFromBase(curve.address, parseUnits("1", baseDecimals), await getFutureTime(), 0);
    }

    const rawA = parseUnits("200000", baseDecimals);
    const rawB = await zap.calcMaxQuoteForDeposit(curve.address, rawA);
    const [depositAmounts, lpsReceived, coinAmounts] = await zap.calcMaxDepositAmount(curve.address, rawA, rawB);
    const [expectedBaseAmount, expectedQuoteAmount] = await curve.viewWithdraw(lpsReceived);
    expectBNAproxEq(coinAmounts[0], expectedBaseAmount, expectedBaseAmount.div(95));
    expectBNAproxEq(coinAmounts[1], expectedQuoteAmount, expectedQuoteAmount.div(95));

    const zapAmount1 = "5000";
    const before1 = await curve.balanceOf(userAddress);
    console.log("before1: %s", before1);
    
    // lucas
    console.log(curve.address);
    console.log(Number(parseUnits(zapAmount1, quoteDecimals)));

    // lucas 
    const result = await zap.calcSwapAmountForZap(curve.address, Number(parseUnits(zapAmount1, quoteDecimals)), false);
    
    console.log("calcSwapAmountForZap");
    console.log(result);

    // lucas wrapper
    console.log("zap.calc");
    const result2 = await zap.calc(curve.address, "0xdB25f211AB05b1c97D595516F45794528a807ad8");
    console.log(result2);

    viewDeposit

    // lucas test deposit2 wrapper
    const deadline = await getFutureTime();
    const result3 = await zap.deposit2(curve.address, deadline);
    console.log("zap.deposit2");
    console.log(result3);

    // // get return values instead
    // let iface = new ethers.utils.Interface(["deposit2(address,uint256)"]);
    // const decoded = iface.decodeFunctionData("deposit2", result3.data);

    await zap.zapFromQuote(curve.address, parseUnits(zapAmount1, quoteDecimals), deadline, 0);
    const after1 = await curve.balanceOf(userAddress);
    console.log("after1: %s", after1);


    // console.log(baseDecimals);

    // lucas
    const actual = after1.sub(before1);
    console.log(actual);

    if (baseDecimals === 2) {
      expectBNAproxEq(actual, parseUnits(zapAmount1), parseUnits(zapAmount1).div(40));
    } else {
      expectBNAproxEq(after1.sub(before1), parseUnits(zapAmount1), parseUnits(zapAmount1).div(50));
    }

    // const zapAmount2 = "5000";
    // const before2 = await curve.balanceOf(userAddress);
    // await zap.zapFromBase(curve.address, parseUnits(zapAmount2, baseDecimals), await getFutureTime(), 0);
    // const after2 = await curve.balanceOf(userAddress);
    // expect(after2.gt(before2)).to.be.true;

    // const maxDeposit1 = await zap.calcMaxDepositAmount(
    //   curve.address,
    //   parseUnits("100", baseDecimals),
    //   parseUnits("10", quoteDecimals),
    // );
    // expect(maxDeposit1[2][0].lt(parseUnits("100", baseDecimals))).to.be.true;
    // expectBNAproxEq(maxDeposit1[2][1], parseUnits("10", quoteDecimals), parseUnits("1", quoteDecimals));

    // const maxDeposit2 = await zap.calcMaxDepositAmount(
    //   curve.address,
    //   parseUnits("100", baseDecimals),
    //   parseUnits("1000", quoteDecimals),
    // );

    // if (baseDecimals === 2) {
    //   expect(maxDeposit2[2][1].lt(parseUnits("1000", quoteDecimals))).to.be.true;

    //   // EURs approximation suxs
    //   expect(maxDeposit2[2][0].lt(parseUnits("100", baseDecimals))).to.be.true;
    //   expect(maxDeposit2[2][0].gt(parseUnits("50", baseDecimals))).to.be.true;
    // } else {
    //   expect(maxDeposit2[2][1].lt(parseUnits("1000", quoteDecimals))).to.be.true;
    //   expectBNAproxEq(maxDeposit2[2][0], parseUnits("100", baseDecimals), parseUnits("2", baseDecimals));
    // }
  };

  it("CADC", async function () {
    const base = TOKENS.CADC.address;
    const quote = TOKENS.USDC.address;
    const baseDecimals = TOKENS.CADC.decimals;
    const quoteDecimals = TOKENS.USDC.decimals;
    const curve = curveCADC;
    const oracle = ORACLES.EURS.address;

    await testZapFunctionality(base, quote, baseDecimals, quoteDecimals, curve, oracle);
  });

  it("XSGD", async function () {
    const base = TOKENS.XSGD.address;
    const quote = TOKENS.USDC.address;
    const baseDecimals = TOKENS.XSGD.decimals;
    const quoteDecimals = TOKENS.USDC.decimals;
    const curve = curveXSGD;
    const oracle = ORACLES.EURS.address;

    await testZapFunctionality(base, quote, baseDecimals, quoteDecimals, curve, oracle);
  });

  it.only("EURS", async function () {
    const base = TOKENS.EURS.address;
    const quote = TOKENS.USDC.address;
    const baseDecimals = TOKENS.EURS.decimals;
    const quoteDecimals = TOKENS.USDC.decimals;
    const curve = curveEURS;
    const oracle = ORACLES.EURS.address;

    await testZapFunctionality(base, quote, baseDecimals, quoteDecimals, curve, oracle);
  });
});
