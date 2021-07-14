require("dotenv").config();
import { ethers } from "hardhat";
import { getFutureTime } from "../../test/Utils";
import { CurveFactory } from "../../typechain/CurveFactory";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { Router } from "../../typechain/Router";
import { BigNumberish, Signer } from "ethers";
import { parseUnits, formatUnits, parseEther, formatEther } from "ethers/lib/utils";

/**
 * Values based on mainnet EURS-USDC
 * https://etherscan.io/address/0x1a4Ffe0DCbDB4d551cfcA61A5626aFD190731347#readContract
 * alpha|int128 :  14757395258967641311 -- check decimals?
 * beta|int128 :  9223372036854775826
 * delta|int128 :  4611686018427387921
 * epsilon|int128 :  9223372036854794
 * lambda|int128 :  5534023222112865503
 * totalSupply|uint256 :  4746601093598744202044526
 */
const NAME = "DFX V1";
const SYMBOL = "DFX-V1";
const ALPHA = parseUnits("0.8");
const BETA = parseUnits("0.5");
const MAX = parseUnits("0.15");
const EPSILON = parseUnits("0.0005"); // 5 basis point
const LAMBDA = parseUnits("0.3");

let TOKEN_USDC: string;
let TOKEN_EURS: string;
//const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
//const TOKENS_EURS_DECIMALS = process.env.TOKENS_EURS_DECIMALS;

export const getDeployer = async (): Promise<{
  deployer: Signer;
  user1: Signer;
  user2: Signer;
}> => {
  const [deployer, user1, user2] = await ethers.getSigners();
  return {
    deployer,
    user1,
    user2,
  };
};

async function main() {
  let _deployer: any;
  let _user1: any;

  const { deployer, user1 } = await getDeployer();
  _deployer = deployer;
  _user1 = user1;

  TOKEN_USDC = process.env.TOKENS_USDC_KOVAN_ADDR;
  TOKEN_EURS = process.env.TOKENS_EURS_KOVAN_ADDR;

  console.log("1 - Deploying DFX Contracts");
  const CurvesLib = await ethers.getContractFactory("Curves");
  const OrchestratorLib = await ethers.getContractFactory("Orchestrator");
  const ProportionalLiquidityLib = await ethers.getContractFactory("ProportionalLiquidity");
  const SwapsLib = await ethers.getContractFactory("Swaps");
  const ViewLiquidityLib = await ethers.getContractFactory("ViewLiquidity");

  const curvesLib = await CurvesLib.deploy();
  console.log("Curves Contract address: ", curvesLib.address);
  const orchestratorLib = await OrchestratorLib.deploy();
  console.log("Orchestrator Contract address: ", orchestratorLib.address);
  const proportionalLiquidityLib = await ProportionalLiquidityLib.deploy();
  console.log("ProportionalLiquidity Contract address: ", proportionalLiquidityLib.address);
  const swapsLib = await SwapsLib.deploy();
  console.log("Swaps Contract address: ", swapsLib.address);
  const viewLiquidityLib = await ViewLiquidityLib.deploy();
  console.log("ViewLiquidity Contract address: ", viewLiquidityLib.address);
  const UsdcToUsdAssimilator = await ethers.getContractFactory("UsdcToUsdAssimilator");
  const EursToUsdAssimilator = await ethers.getContractFactory("EursToUsdAssimilator");
  const usdcToUsdAssimilator = await UsdcToUsdAssimilator.deploy({ gasLimit: 12000000 });
  console.log("UsdcToUsdAssimilator Contract address: ", usdcToUsdAssimilator.address);
  const eursToUsdAssimilator = await EursToUsdAssimilator.deploy({ gasLimit: 12000000 });
  console.log("EursToUsdAssimilator Contract address: ", eursToUsdAssimilator.address);

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
  console.log("CurveFactory Contract address: ", curveFactory.address);
  const router = (await RouterFactory.deploy(curveFactory.address, { gasLimit: 12000000 })) as Router;
  console.log("Router Contract address: ", router.address);

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
  console.log("Checking token value for deposit");
  const depositToCurveEURS = await curveEURS.connect(_deployer).viewDeposit(parseUnits("5000000000000000"));
  // Amount of tokens for each address required
  console.log(formatUnits(depositToCurveEURS[1][0], "2"), " EUR");
  console.log(formatUnits(depositToCurveEURS[1][1], "6"), " USDC");

  await curveEURS
    .connect(_deployer)
    .deposit(parseUnits("5000000000000000"), await getFutureTime())
    .then(x => x.wait());

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

  console.log("Checking curve values");
  const viewCurves = await curveEURS.connect(_deployer).viewCurve();
  console.log("Alpha: ", formatEther(viewCurves[0]));
  console.log("Beta: ", formatEther(viewCurves[1]));
  console.log("Max: ", formatEther(viewCurves[2]));
  console.log("Epsilon: ", formatEther(viewCurves[3]));
  console.log("Lambda: ", formatEther(viewCurves[4]));

  // TODO: Check why this small, check math?
  console.log("7 - Swapping 10 EUR to USDC");
  const beforeBalance = await usdc.balanceOf(await _deployer.getAddress());
  console.log("Before USDC bal", formatUnits(beforeBalance, "6"));

  const swapTxn = await curveEURS
    .connect(_deployer)
    .originSwap(eurs.address, usdc.address, 1000, 0, await getFutureTime(), {
      gasLimit: 3000000,
    });

  console.log(await swapTxn.wait());
  const afterBalance = await usdc.balanceOf(await _deployer.getAddress());
  console.log("Difference after swap:", formatUnits(afterBalance.sub(beforeBalance), 6));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
