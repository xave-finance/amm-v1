import hre from "hardhat";
import chalk from "chalk";
import path from "path";
import fs from "fs";

import { getAccounts, deployContract } from "./common";

const { ethers } = hre;

async function main() {
  const { user } = await getAccounts();

  console.log(chalk.blue(`>>>>>>>>>>>> Network: ${(hre.network.config as any).url} <<<<<<<<<<<<`));
  console.log(chalk.blue(`>>>>>>>>>>>> Deployer: ${user.address} <<<<<<<<<<<<`));

  const CurvesLib = await ethers.getContractFactory("Curves");
  const OrchestratorLib = await ethers.getContractFactory("Orchestrator");
  const ProportionalLiquidityLib = await ethers.getContractFactory("ProportionalLiquidity");
  const SwapsLib = await ethers.getContractFactory("Swaps");
  const ViewLiquidityLib = await ethers.getContractFactory("ViewLiquidity");

  const curvesLib = await deployContract({
    name: "CuvesLib",
    deployer: user,
    factory: CurvesLib,
    args: [],
    opts: {
      gasLimit: 800000,
    },
  });

  const orchestratorLib = await deployContract({
    name: "OrchestratorLib",
    deployer: user,
    factory: OrchestratorLib,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  const proportionalLiquidityLib = await deployContract({
    name: "ProportionalLiquidityLib",
    deployer: user,
    factory: ProportionalLiquidityLib,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  const swapsLib = await deployContract({
    name: "SwapsLib",
    deployer: user,
    factory: SwapsLib,
    args: [],
    opts: {
      gasLimit: 3000000,
    },
  });

  const viewLiquidityLib = await deployContract({
    name: "ViewLiquidityLib",
    deployer: user,
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
    deployer: user,
    factory: CurveFactory,
    args: [],
    opts: {
      gasLimit: 4000000,
    },
  });
  console.log("curveFactory deployed by ", user.address, " and owner is ", await curveFactory.owner());

  const router = await deployContract({
    name: "Router",
    deployer: user,
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
  const timestamp = new Date().getTime().toString();
  const outputLogPath = path.join(__dirname, `./deployed_contract_logs/${timestamp}_factory_deployed.json`);
  fs.writeFileSync(outputLogPath, JSON.stringify(output, null, 4));

  // Deployed contracts config
  const outputConfigPath = './scripts/config/factory_deployed.json';
  fs.writeFileSync(outputConfigPath, JSON.stringify(output, null, 4));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
