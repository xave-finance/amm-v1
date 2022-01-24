import hre from "hardhat";
import chalk from "chalk";

const { ethers } = hre;

import { getAccounts, deployContract } from "./common";
import { deployedLogs, isArbitrumNetwork } from "./Utils";

async function main() {
  const users = await getAccounts();
  const user1 = users[0];

  console.log(chalk.blue(`>>>>>>>>>>>> Network: ${(hre.network.config as any).url} <<<<<<<<<<<<`));
  console.log(chalk.blue(`>>>>>>>>>>>> Deployer: ${user1.address} <<<<<<<<<<<<`));

  const Factory = await ethers.getContractFactory("Zap");

  const zap = await deployContract({
    name: "zap",
    deployer: user1,
    factory: Factory,
    args: [],
    opts: {
      gasLimit: isArbitrumNetwork() ? 300000000 : 3000000,
    },
  });

  const output = {
    zap: zap.address,
  };

  // Deployed contracts log
  await deployedLogs("zap_deployed", output);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
