require("dotenv").config();
import { ethers } from "hardhat";

import { mintCADC, mintEURS, mintUSDC, mintXSGD, getFutureTime } from "../../test/Utils";

import { CurveFactory } from "../../typechain/CurveFactory";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { Router } from "../../typechain/Router";
import { BigNumberish, Signer } from "ethers";
import { parseUnits, formatUnits } from "ethers/lib/utils";

const hre = require("hardhat")

const NAME = "DFX V1";
const SYMBOL = "DFX-V1";

// Weights are always 50/50

// Pool must respect a 10/90 ratio
// i.e. value of one pair cannot exceed 90% of the pools value
const ALPHA = parseUnits("0.8");

// Slippage (fees) will that will be introduced when one of the tokens's ratio:
// - exceeds 75% of the pool value
// - goes under 25% of the pool value
const BETA = parseUnits("0.5");

const MAX = parseUnits("0.15");
const EPSILON = parseUnits("0.0005"); // 5 basis point
const LAMBDA = parseUnits("0.3");

const netObj = JSON.parse(process.env.npm_config_argv).original;
const NETWORK = netObj[netObj.length - 1];

const LOCAL_NODE = process.env.LOCAL_NODE;
const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE);

const CONTRACT_CURVE_FACTORY_ADDR = process.env.CONTRACT_CURVE_FACTORY_ADDR;
const CONTRACT_EURSTOUSDASSIMILATOR_ADDR = process.env.CONTRACT_EURSTOUSDASSIMILATOR_ADDR;
const CONTRACT_USDCTOUSDASSIMILATOR_ADDR = process.env.CONTRACT_USDCTOUSDASSIMILATOR_ADDR;

let TOKEN_USDC: string;
let TOKEN_EURS: string;
const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
const TOKENS_EURS_DECIMALS = process.env.TOKENS_EURS_DECIMALS;

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

  if (NETWORK === 'localhost') {
    _deployer = await provider.getSigner();
    _user1 = await provider.getSigner(1);

    TOKEN_USDC = process.env.TOKENS_USDC_MAINNET_ADDR;
    TOKEN_EURS = process.env.TOKENS_EURS_MAINNET_ADDR
  } else {
    const { deployer, user1 } = await getDeployer();
    _deployer = deployer;
    _user1 = user1;

    TOKEN_USDC = process.env.TOKENS_USDC_KOVAN_ADDR;
    TOKEN_EURS = process.env.TOKENS_EURS_KOVAN_ADDR
  }

  const CurvesLib = await ethers.getContractFactory("Curves");
  const OrchestratorLib = await ethers.getContractFactory("Orchestrator");
  const ProportionalLiquidityLib = await ethers.getContractFactory("ProportionalLiquidity");
  const SwapsLib = await ethers.getContractFactory("Swaps");
  const ViewLiquidityLib = await ethers.getContractFactory("ViewLiquidity");

  const curvesLib = await CurvesLib.deploy();
  console.log('Curves Contract address: ', curvesLib.address)

  const orchestratorLib = await OrchestratorLib.deploy();
  console.log('Orchestrator Contract address: ', orchestratorLib.address)
  const proportionalLiquidityLib = await ProportionalLiquidityLib.deploy();
  console.log('ProportionalLiquidity Contract address: ', proportionalLiquidityLib.address)
  const swapsLib = await SwapsLib.deploy();
  console.log('Swaps Contract address: ', swapsLib.address)
  const viewLiquidityLib = await ViewLiquidityLib.deploy();
  console.log('ViewLiquidity Contract address: ', viewLiquidityLib.address)

  const UsdcToUsdAssimilator = await ethers.getContractFactory("UsdcToUsdAssimilator");
  const EursToUsdAssimilator = await ethers.getContractFactory("EursToUsdAssimilator");

  const usdcToUsdAssimilator = await UsdcToUsdAssimilator.deploy({ gasLimit: 12000000 });
  console.log('UsdcToUsdAssimilator Contract address: ', usdcToUsdAssimilator.address)
  const eursToUsdAssimilator = await EursToUsdAssimilator.deploy({ gasLimit: 12000000 });
  console.log('EursToUsdAssimilator Contract address: ', eursToUsdAssimilator.address)

  const usdc = (await ethers.getContractAt("ERC20", TOKEN_USDC)) as ERC20;
  const eurs = (await ethers.getContractAt("ERC20", TOKEN_EURS)) as ERC20;

  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;

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
  console.log('CurveFactory Contract address: ', curveFactory.address)

  const router = (await RouterFactory.deploy(curveFactory.address, { gasLimit: 12000000 })) as Router;
  console.log('Router Contract address: ', router.address)

  // console.log('-------------------- Verifying Curves Contract');
  // await hre.run('verify:verify', {
  //   address: curvesLib.address
  // })

  // console.log('-------------------- Verifying Orchestrator Contract');
  // await hre.run('verify:verify', {
  //   address: orchestratorLib.address
  // })

  // console.log('-------------------- Verifying ProportionalLiquidity Contract');
  // await hre.run('verify:verify', {
  //   address: proportionalLiquidityLib.address
  // })

  // console.log('-------------------- Verifying Swaps Contract');
  // await hre.run('verify:verify', {
  //   address: swapsLib.address
  // })

  // console.log('-------------------- Verifying ViewLiquidity Contract');
  // await hre.run('verify:verify', {
  //   address: viewLiquidityLib.address
  // })

  // console.log('-------------------- Verifying CadcToUsdAssimilator Contract');
  // await hre.run('verify:verify', {
  //   address: cadcToUsdAssimilator.address
  // })

  // console.log('-------------------- Verifying UsdcToUsdAssimilator Contract');
  // await hre.run('verify:verify', {
  //   address: usdcToUsdAssimilator.address
  // })

  // console.log('-------------------- Verifying EursToUsdAssimilator Contract');
  // await hre.run('verify:verify', {
  //   address: eursToUsdAssimilator.address
  // })

  // console.log('-------------------- Verifying XsgdToUsdAssimilator Contract');
  // await hre.run('verify:verify', {
  //   address: xsgdToUsdAssimilator.address
  // })

  // console.log('-------------------- Verifying CurveFactory Contract');
  // await hre.run('verify:verify', {
  //   address: curveFactory.address
  // })

  // console.log('-------------------- Verifying Router Contract');
  // await hre.run('verify:verify', {
  //   address: "0xC5B8F7b0d67d66b04ABCD3210524fdb03B4D532C",
  //   constructorArguments: [
  //     "0x1361B1d9A4cCE04E384F65E0739923a7b2202B6f"
  //   ]
  // })

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

    console.log('CurveFactory#newCurve TX Hash: ', tx.hash)

    // Get curve address
    const curveAddress = await curveFactory.curves(
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "address"], [base, quote])),
    );
    console.log('CurveFactory#curves Address: ', curveAddress)
    const curveLpToken = (await ethers.getContractAt("ERC20", curveAddress)) as ERC20;
    const curve = (await ethers.getContractAt("Curve", curveAddress)) as Curve;

    const turnOffWhitelisting = await curve.turnOffWhitelisting();
    console.log('Curve#turnOffWhitelisting TX Hash: ', turnOffWhitelisting.hash)

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
    console.log('Curve#setParams TX Hash: ', tx.hash)
    await tx.wait();

    return {
      curve,
      curveLpToken,
    };
  };

  const mintAndApprove = async function (
    tokenAddress: string,
    minter: Signer,
    amount: BigNumberish,
    recipient: string,
  ) {
    const minterAddress = await minter.getAddress();

    if (tokenAddress.toLowerCase() === TOKEN_USDC.toLowerCase()) {
      await mintUSDC(minterAddress, amount);
    }

    if (tokenAddress.toLowerCase() === TOKEN_EURS.toLowerCase()) {
      await mintEURS(minterAddress, amount);
    }

    await erc20.attach(tokenAddress).connect(minter).approve(recipient, amount);
  };

  const multiMintAndApprove = async function (requests: [string, Signer, BigNumberish, string][]) {
    for (let i = 0; i < requests.length; i++) {
      await mintAndApprove(...requests[i]);
    }
  };

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

  // Supply liquidity to the pools
  // Mint tokens and approve
  await multiMintAndApprove([
    [TOKEN_USDC, _deployer, parseUnits("10000000", TOKENS_USDC_DECIMALS), curveEURS.address],
    [TOKEN_EURS, _deployer, parseUnits("10000000", TOKENS_EURS_DECIMALS), curveEURS.address],
    [TOKEN_EURS, _user1, parseUnits("5000000", TOKENS_EURS_DECIMALS), curveEURS.address],
  ]);

  await curveEURS
    .connect(_deployer)
    .deposit(parseUnits("5000000"), await getFutureTime())
    .then(x => x.wait());

  console.log(`Scaffolding done. Each pool is initialized with 10mil USD liquidity`);
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

  // -------- Commented out by default
  // console.log("ALPHA", formatUnits(ALPHA));
  // console.log("BETA", formatUnits(BETA));
  // console.log("MAX", formatUnits(MAX));
  // console.log("EPSILON", formatUnits(EPSILON));
  // console.log("LAMBDA", formatUnits(LAMBDA));

  console.log("Swapping 1000000 EUR to USDC");
  console.log("Before USDC bal", formatUnits(await usdc.balanceOf(await _user1.getAddress()), 6));
  await eurs.connect(_user1).approve(curveEURS.address, ethers.constants.MaxUint256);
  await curveEURS
    .connect(_user1)
    .originSwap(eurs.address, usdc.address, parseUnits("1000000", TOKENS_EURS_DECIMALS), 0, await getFutureTime());
  console.log("After USDC bal", formatUnits(await usdc.balanceOf(await _user1.getAddress()), 6));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
