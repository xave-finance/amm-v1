import hre from "hardhat";
import chalk from "chalk";
const { ethers } = hre;

import { getAccounts, deployContract } from "./common";
import { deployedLogs } from "./Utils";

async function main() {
  const { user1 } = await getAccounts();

  const UsdcToUsdAssimilator = await ethers.getContractFactory("UsdcToUsdAssimilator");
  const EursToUsdAssimilator = await ethers.getContractFactory("EursToUsdAssimilator");

  const usdcToUsdAssimilator = await deployContract({
    name: "UsdcToUsdAssimilator",
    deployer: user1,
    factory: UsdcToUsdAssimilator,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  const eursToUsdAssimilator = await deployContract({
    name: "EursToUsdAssimilator",
    deployer: user1,
    factory: EursToUsdAssimilator,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  const output = {
    usdcToUsdAssimilator: usdcToUsdAssimilator.address,
    eursToUsdAssimilator: eursToUsdAssimilator.address,
  };

  // Deployed contracts log
  await deployedLogs(hre.network.name, 'assimilators_deployed', output);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
