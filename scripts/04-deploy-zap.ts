import hre from "hardhat";
import chalk from "chalk";
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";

import { getAccounts, deployContract } from "./common";

const { ethers } = hre;

async function main() {
  const { user } = await getAccounts();

  console.log(chalk.blue(`>>>>>>>>>>>> Network: ${(hre.network.config as any).url} <<<<<<<<<<<<`));
  console.log(chalk.blue(`>>>>>>>>>>>> Deployer: ${user.address} <<<<<<<<<<<<`));

  const Factory = await ethers.getContractFactory("Zap");

  const zap = await deployContract({
    name: "zap",
    deployer: user,
    factory: Factory,
    args: [],
    opts: {
      gasLimit: 3000000,
    },
  });

  const output = {
    zap: zap.address,
  };

  // Deployed contracts log
  const outputLogDir = path.join(__dirname, `./deployed_contract_logs/${hre.network.name}`);
  // Just like mkdir -p, it will create directory if it doesn't exist
  // If it already exists, then it will not print an error and will move further to create sub-directories.
  mkdirp.sync(outputLogDir);

  const timestamp = new Date().getTime().toString();
  const outputLogPath = path.join(`${outputLogDir}/${timestamp}_zap_deployed.json`);
  fs.writeFileSync(outputLogPath, JSON.stringify(output, null, 4));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
