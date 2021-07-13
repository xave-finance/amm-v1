require("dotenv").config();
import { ethers } from "hardhat";
import { Signer } from "ethers";

import { CurveFactory } from "../../typechain/CurveFactory";
import { Router } from "../../typechain/Router";

const netObj = JSON.parse(process.env.npm_config_argv).original;
const NETWORK = netObj[netObj.length - 1]

const LOCAL_NODE = process.env.LOCAL_NODE;
const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE);

export const getDeployer = async (): Promise<{
  deployer: Signer;
  user1: Signer
}> => {
  const [deployer, user1] = await ethers.getSigners();
  return {
    deployer,
    user1
  };
};

async function main() {
  let _deployer: any;
  let _user1: any;

  if (NETWORK === 'localhost') {
    _deployer = await provider.getSigner();
    _user1 = await provider.getSigner(1);
  } else {
    const { deployer, user1 } = await getDeployer();
    _deployer = deployer;
    _user1 = user1;
  }

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await _deployer.getAddress()}`);
  console.log(`Deployer balance: ${await _deployer.getBalance()}`)
  console.log(`User1 account: ${await _user1.getAddress()}`);
  console.log(`User1 balance: ${await _user1.getBalance()}`)

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
  const JpyToUsdAssimilator = await ethers.getContractFactory("JpyToUsdAssimilator");

  const usdcToUsdAssimilator = await UsdcToUsdAssimilator.deploy({ gasLimit: 12000000 });
  const jpyToUsdAssimilator = await JpyToUsdAssimilator.deploy({ gasLimit: 12000000 });

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

  console.log(`CONTRACT_CURVES_ADDR=${curvesLib.address}`)
  console.log(`CONTRACT_ORCHESTRATOR_ADDR=${orchestratorLib.address}`)
  console.log(`CONTRACT_PROPORTIONAL_LIQUIDITY_ADDR=${proportionalLiquidityLib.address}`)
  console.log(`CONTRACT_SWAPS_ADDR=${swapsLib.address}`)
  console.log(`CONTRACT_VIEW_LIQUIDITY_ADDR=${viewLiquidityLib.address}`)
  console.log(`CONTRACT_USDCTOUSDASSIMILATOR_ADDR=${usdcToUsdAssimilator.address}`)
  console.log(`CONTRACT_JPYTOUSDASSIMILATOR_ADDR=${jpyToUsdAssimilator.address}`)
  console.log(`CONTRACT_CURVE_FACTORY_ADDR=${curveFactory.address}`)
  console.log(`CONTRACT_ROUTER_ADDR=${router.address}`)

  console.log(`Deployer balance: ${await _deployer.getBalance()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
