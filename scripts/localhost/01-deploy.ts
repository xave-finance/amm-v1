const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.localhost') });

import { ethers } from "hardhat";
import { CurveFactory } from "../../typechain/CurveFactory";
import { Router } from "../../typechain/Router";

async function main() {
  console.log(process.env.CONTRACT_CORE_CURVES_ADDR);

  const [deployer, user1] = await ethers.getSigners();

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await deployer.getAddress()}`);
  console.log(`Deployer balance: ${await deployer.getBalance()}`)
  console.log(`User1 account: ${await user1.getAddress()}`);
  console.log(`User1 balance: ${await user1.getBalance()}`)

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

  const LocalhostUsdcToUsdAssimilator = await ethers.getContractFactory("LocalhostUsdcToUsdAssimilator");
  const LocalhostEursToUsdAssimilator = await ethers.getContractFactory("LocalhostEursToUsdAssimilator");

  const localhostUsdcToUsdAssimilator = await LocalhostUsdcToUsdAssimilator.deploy({ gasLimit: 12000000 });
  const localhostEursToUsdAssimilator = await LocalhostEursToUsdAssimilator.deploy({ gasLimit: 12000000 });

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

  console.log(`CONTRACT_CORE_CURVES_ADDR=${curvesLib.address}`)
  console.log(`CONTRACT_CORE_ORCHESTRATOR_ADDR=${orchestratorLib.address}`)
  console.log(`CONTRACT_CORE_PROPORTIONAL_LIQUIDITY_ADDR=${proportionalLiquidityLib.address}`)
  console.log(`CONTRACT_CORE_SWAPS_ADDR=${swapsLib.address}`)
  console.log(`CONTRACT_CORE_VIEW_LIQUIDITY_ADDR=${viewLiquidityLib.address}`)
  console.log(`CONTRACT_CORE_CURVE_FACTORY_ADDR=${curveFactory.address}`)
  console.log(`CONTRACT_CORE_ROUTER_ADDR=${router.address}`)

  console.log(`CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR=${localhostUsdcToUsdAssimilator.address}`);
  console.log(`CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR=${localhostEursToUsdAssimilator.address}`);

  console.log(`Deployer balance: ${await deployer.getBalance()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });