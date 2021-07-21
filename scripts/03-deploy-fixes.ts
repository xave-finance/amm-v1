import hre from "hardhat";
import chalk from "chalk";
import path from "path";
import fs from "fs";
import { CONTRACTS } from "./contracts";

import { getAccounts, deployContract } from "./common";

const { ethers } = hre;

const PREVIOUS_DEPLOYMENT = {
  libraries: {
    Curves: CONTRACTS.curves,
    Orchestrator: CONTRACTS.orchestrator,
    Swaps: CONTRACTS.swaps,
    ViewLiquidity: CONTRACTS.viewLiquidity,
  },
};
console.log("PREVIOUS_DEPLOYMENT ", PREVIOUS_DEPLOYMENT);

async function main() {
  const { user } = await getAccounts();

  console.log(chalk.blue(`>>>>>>>>>>>> Network: ${(hre.network.config as any).url} <<<<<<<<<<<<`));
  console.log(chalk.blue(`>>>>>>>>>>>> Deployer: ${user.address} <<<<<<<<<<<<`));

  const UsdcToUsdAssimilator = await ethers.getContractFactory("UsdcToUsdAssimilator");
  const ProportionalLiquidityLib = await ethers.getContractFactory("ProportionalLiquidity");

  const proportionalLiquidityLib = await deployContract({
    name: "ProportionalLiquidityLib",
    deployer: user,
    factory: ProportionalLiquidityLib,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  const CurveFactory = await ethers.getContractFactory("CurveFactory", {
    libraries: {
      Curves: PREVIOUS_DEPLOYMENT.libraries.Curves,
      Orchestrator: PREVIOUS_DEPLOYMENT.libraries.Orchestrator,
      ProportionalLiquidity: proportionalLiquidityLib.address,
      Swaps: PREVIOUS_DEPLOYMENT.libraries.Swaps,
      ViewLiquidity: PREVIOUS_DEPLOYMENT.libraries.ViewLiquidity,
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

  const router = await deployContract({
    name: "Router",
    deployer: user,
    factory: RouterFactory,
    args: [curveFactory.address],
    opts: {
      gasLimit: 4000000,
    },
  });

  const usdcToUsdAssimilator = await deployContract({
    name: "UsdcToUsdAssimilator",
    deployer: user,
    factory: UsdcToUsdAssimilator,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  const output = {
    libraries: {
      ...PREVIOUS_DEPLOYMENT.libraries,
      ProportionalLiquidity: proportionalLiquidityLib.address,
    },
    curveFactory: curveFactory.address,
    router: router.address,
    usdcToUsdAssimilator: usdcToUsdAssimilator.address,
  };

  const outputPath = path.join(__dirname, "./deployLogs/" + new Date().getTime().toString() + `_fixes_deployed.json`);
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 4));

  const overwriteOutputPath = path.join(__dirname, `fixes_deployed.json`);
  fs.writeFileSync(overwriteOutputPath, JSON.stringify(output, null, 4));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
