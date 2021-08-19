import hre from "hardhat";
import chalk from "chalk";
const { ethers } = hre;

import { getAccounts, deployContract } from "../common";
import { deployedLogs } from "../Utils";

async function main() {
  const { user } = await getAccounts();

  console.log(chalk.blue(`>>>>>>>>>>>> Network: ${(hre.network.config as any).url} <<<<<<<<<<<<`));
  console.log(chalk.blue(`>>>>>>>>>>>> Deployer: ${user.address} <<<<<<<<<<<<`));

  const XsgdToUsdAssimilator = await ethers.getContractFactory("XsgdToUsdAssimilator");

  const xsgdToUsdAssimilator = await deployContract({
    name: "XsgdToUsdAssimilator",
    deployer: user,
    factory: XsgdToUsdAssimilator,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  const output = {
    xsgdToUsdAssimilator: xsgdToUsdAssimilator.address
  };

  // Deployed contracts log
  await deployedLogs('new_assimilators_deployed', output);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
