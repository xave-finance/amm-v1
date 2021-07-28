import hre from "hardhat";
import chalk from "chalk";

const { ethers } = hre;

import { getAccounts, deployContract } from "./common";
import { deployedLogs } from "./Utils";

async function main() {
  const { user1 } = await getAccounts();

  const CurvesLib = await ethers.getContractFactory("Curves");
  const OrchestratorLib = await ethers.getContractFactory("Orchestrator");
  const ProportionalLiquidityLib = await ethers.getContractFactory("ProportionalLiquidity");
  const SwapsLib = await ethers.getContractFactory("Swaps");
  const ViewLiquidityLib = await ethers.getContractFactory("ViewLiquidity");

  const curvesLib = await deployContract({
    name: "CuvesLib",
    deployer: user1,
    factory: CurvesLib,
    args: [],
    opts: {
      gasLimit: 800000,
    },
  });

  const orchestratorLib = await deployContract({
    name: "OrchestratorLib",
    deployer: user1,
    factory: OrchestratorLib,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  const proportionalLiquidityLib = await deployContract({
    name: "ProportionalLiquidityLib",
    deployer: user1,
    factory: ProportionalLiquidityLib,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  const swapsLib = await deployContract({
    name: "SwapsLib",
    deployer: user1,
    factory: SwapsLib,
    args: [],
    opts: {
      gasLimit: 3000000,
    },
  });

  const viewLiquidityLib = await deployContract({
    name: "ViewLiquidityLib",
    deployer: user1,
    factory: ViewLiquidityLib,
    args: [],
    opts: {
      gasLimit: 400000,
    },
  });

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

  const curveFactory = await deployContract({
    name: "CurveFactory",
    deployer: user1,
    factory: CurveFactory,
    args: [],
    opts: {
      gasLimit: 4000000,
    },
  });
  console.log("curveFactory deployed by ", user1.address, " and owner is ", await curveFactory.owner());

  const router = await deployContract({
    name: "Router",
    deployer: user1,
    factory: RouterFactory,
    args: [curveFactory.address],
    opts: {
      gasLimit: 4000000,
    },
  });

  const output = {
    libraries: {
      Curves: curvesLib.address,
      Orchestrator: orchestratorLib.address,
      ProportionalLiquidity: proportionalLiquidityLib.address,
      Swaps: swapsLib.address,
      ViewLiquidity: viewLiquidityLib.address,
    },
    curveFactory: curveFactory.address,
    router: router.address,
  };

  // Deployed contracts log
  await deployedLogs(hre.network.name, 'factory_deployed', output);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
