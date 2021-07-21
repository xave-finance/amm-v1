require("dotenv").config();
import { ethers } from "hardhat";
import { CurveFactory } from "../../typechain/CurveFactory";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { Router } from "../../typechain/Router";
import { BigNumberish } from "ethers";
import { parseUnits, parseEther } from "ethers/lib/utils";
import { formatCurrency, getFutureTime, parseCurrency, TOKEN_DECIMAL, TOKEN_NAME } from "../utils";

const NAME = "DFX V1";
const SYMBOL = "DFX-V1";
const ALPHA = parseUnits("0.8");
const BETA = parseUnits("0.5");
const MAX = parseUnits("0.15");
const EPSILON = parseUnits("0.0005"); // 5 basis point
const LAMBDA = parseUnits("0.3");

async function main() {
  const [_deployer, _user1] = await ethers.getSigners();
  const provider = _deployer.provider; // get provider instance from deployer or account[0]

  const TOKEN_USDC = process.env.TOKENS_USDC_KOVAN_ADDR;
  const TOKEN_EURS = process.env.TOKENS_EURS_KOVAN_ADDR;

  console.log("1 - Deploying DFX Contracts");
  const CurvesLib = await ethers.getContractFactory("Curves");
  const OrchestratorLib = await ethers.getContractFactory("Orchestrator");
  const ProportionalLiquidityLib = await ethers.getContractFactory("ProportionalLiquidity");
  const SwapsLib = await ethers.getContractFactory("Swaps");
  const ViewLiquidityLib = await ethers.getContractFactory("ViewLiquidity");

  const curvesLib = await CurvesLib.deploy();
  const orchestratorLib = await OrchestratorLib.deploy();
  const proportionalLiquidityLib = await ProportionalLiquidityLib.deploy();
  const swapsLib = await SwapsLib.deploy();
  const viewLiquidityLib = await ViewLiquidityLib.deploy();
  const UsdcToUsdAssimilator = await ethers.getContractFactory("UsdcToUsdAssimilator");
  const EursToUsdAssimilator = await ethers.getContractFactory("EursToUsdAssimilator");
  const usdcToUsdAssimilator = await UsdcToUsdAssimilator.deploy({ gasLimit: 12000000 });
  const eursToUsdAssimilator = await EursToUsdAssimilator.deploy({ gasLimit: 12000000 });

  console.log(`CONTRACT_CURVES_ADDR=${curvesLib.address}`);
  console.log(`CONTRACT_ORCHESTRATOR_ADDR=${orchestratorLib.address}`);
  console.log(`CONTRACT_PROPORTIONAL_LIQUIDITY_ADDR=${proportionalLiquidityLib.address}`);
  console.log(`CONTRACT_SWAPS_ADDR=${swapsLib.address}`);
  console.log(`CONTRACT_VIEW_LIQUIDITY_ADDR=${viewLiquidityLib.address}`);
  console.log(`CONTRACT_USDCTOUSDASSIMILATOR_ADDR=${usdcToUsdAssimilator.address}`);
  console.log(`CONTRACT_EURSTOUSDASSIMILATOR_ADDR=${eursToUsdAssimilator.address}`);
  // console.log(`CONTRACT_CADCTOUSDASSIMILATOR_ADDR=${cadcToUsdAssimilator.address}`)
  // console.log(`CONTRACT_XSGDTOUSDASSIMILATOR_ADDR=${xsgdToUsdAssimilator.address}`)

  console.log("2 - Getting erc20 token references");
  const usdc = (await ethers.getContractAt("ERC20", TOKEN_USDC)) as ERC20;
  const eurs = (await ethers.getContractAt("ERC20", TOKEN_EURS)) as ERC20;
  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;

  console.log("3 - Deploying curve factory and router factory");
  const CurveFactory = await ethers.getContractFactory("CurveFactory", {
    libraries: {
      Curves: curvesLib.address,
      Orchestrator: orchestratorLib.address,
      ProportionalLiquidity: proportionalLiquidityLib.address,
      Swaps: swapsLib.address,
      ViewLiquidity: viewLiquidityLib.address,
    },
  });

  const RouterFactory = await ethers.getContractFactory("Router");
  const curveFactory = (await CurveFactory.deploy({ gasLimit: 12000000 })) as CurveFactory;
  const router = (await RouterFactory.deploy(curveFactory.address, { gasLimit: 12000000 })) as Router;
  console.log(`CONTRACT_CURVE_FACTORY_ADDR=${curveFactory.address}`);
  console.log(`CONTRACT_ROUTER_ADDR=${router.address}`);

  const createCurve = async function ({
    name,
    symbol,
    base,
    quote,
    baseWeight,
    quoteWeight,
    baseAssimilator,
    quoteAssimilator,
  }: {
    name: string;
    symbol: string;
    base: string;
    quote: string;
    baseWeight: BigNumberish;
    quoteWeight: BigNumberish;
    baseAssimilator: string;
    quoteAssimilator: string;
  }): Promise<{ curve: Curve; curveLpToken: ERC20 }> {
    const tx = await curveFactory.newCurve(
      name,
      symbol,
      base,
      quote,
      baseWeight,
      quoteWeight,
      baseAssimilator,
      quoteAssimilator,
      {
        gasLimit: 12000000,
      },
    );
    await tx.wait();
    console.log("CurveFactory#newCurve TX Hash: ", tx.hash);

    // Get curve address
    const curveAddress = await curveFactory.curves(
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "address"], [base, quote])),
    );
    console.log("CurveFactory#curves Address: ", curveAddress);
    const curveLpToken = (await ethers.getContractAt("ERC20", curveAddress)) as ERC20;
    const curve = (await ethers.getContractAt("Curve", curveAddress)) as Curve;

    const turnOffWhitelisting = await curve.turnOffWhitelisting();
    console.log("Curve#turnOffWhitelisting TX Hash: ", turnOffWhitelisting.hash);

    return {
      curve,
      curveLpToken,
    };
  };

  const createCurveAndSetParams = async function ({
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
  }) {
    const { curve, curveLpToken } = await createCurve({
      name,
      symbol,
      base,
      quote,
      baseWeight,
      quoteWeight,
      baseAssimilator,
      quoteAssimilator,
    });

    const tx = await curve.setParams(...params, { gasLimit: 12000000 });
    console.log("Curve#setParams TX Hash: ", tx.hash);
    await tx.wait();

    return {
      curve,
      curveLpToken,
    };
  };

  console.log("4 - Creating EURS curve and setting params.");
  const { curve: curveEURS } = await createCurveAndSetParams({
    name: NAME,
    symbol: SYMBOL,
    base: eurs.address,
    quote: usdc.address,
    baseWeight: parseUnits("0.5"),
    quoteWeight: parseUnits("0.5"),
    baseAssimilator: eursToUsdAssimilator.address,
    quoteAssimilator: usdcToUsdAssimilator.address,
    params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
  });

  console.log("5 - approving allowances and adding liqudity to the curve");
  await usdc.approve(curveEURS.address, ethers.constants.MaxUint256);
  await eurs.approve(curveEURS.address, ethers.constants.MaxUint256);
  await eurs.connect(_user1).approve(curveEURS.address, ethers.constants.MaxUint256);

  console.log("6- Adding liqudity, minting DFX Tokens");

  const LP_TOKENS_AMOUNT = "5000";
  const LP_TOKENS_TO_MINT = parseEther(LP_TOKENS_AMOUNT); // 18 precision
  console.log(`Checking how much liquidity to provide minting ${LP_TOKENS_AMOUNT}`);
  const depositToCurveEURS = await curveEURS.connect(_deployer).viewDeposit(LP_TOKENS_TO_MINT);
  console.log(
    `You will provide ${formatCurrency(
      TOKEN_NAME.EURS,
      TOKEN_DECIMAL.EURS,
      depositToCurveEURS[1][0],
    )} in EURS and ${formatCurrency(
      TOKEN_NAME.USDC,
      TOKEN_DECIMAL.USDC,
      depositToCurveEURS[1][1],
    )} in USDC to receive ${LP_TOKENS_AMOUNT} LP Tokens. Depositing..`,
  );

  const depositTxn = await curveEURS.connect(_deployer).deposit(LP_TOKENS_TO_MINT, await getFutureTime(provider));
  console.log(await depositTxn.wait());

  console.log(`Scaffolding done. Each pool is initialized with 2k USD liquidity`);
  console.log(
    JSON.stringify(
      {
        curveFactory: curveFactory.address,
        curveEURS: curveEURS.address,
        router: router.address,
      },
      null,
      4,
    ),
  );

  console.log("7 - Swapping 10 EUR to USDC");
  const eurAmount = "10";
  console.log(`Exchanging ${eurAmount} EURS to USDC.`);
  const beforeBalance = await usdc.balanceOf(await _deployer.getAddress());
  console.log("Before USDC bal", formatCurrency(TOKEN_NAME.USDC, TOKEN_DECIMAL.USDC, beforeBalance));

  const swapTxn = await curveEURS
    .connect(_deployer)
    .originSwap(
      eurs.address,
      usdc.address,
      parseCurrency(TOKEN_NAME.EURS, TOKEN_DECIMAL.EURS, "10"),
      0,
      await getFutureTime(provider),
      {
        gasLimit: 3000000,
      },
    );

  console.log(await swapTxn.wait());
  const afterBalance = await usdc.balanceOf(await _deployer.getAddress());
  console.log(
    "Difference after swap:",
    formatCurrency(TOKEN_NAME.USDC, TOKEN_DECIMAL.USDC, afterBalance.sub(beforeBalance)),
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
