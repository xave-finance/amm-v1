import hre from "hardhat";
import chalk from "chalk";
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
const { ethers } = hre;

import { getAccounts, deployContract } from "./common";

const ASSIMILATOR_CONTRACT_NAME_USDC = process.env.ASSIMILATOR_CONTRACT_NAME_USDC;
const ASSIMILATOR_CONTRACT_NAME_EURS = process.env.ASSIMILATOR_CONTRACT_NAME_EURS;

async function main() {
  const { user } = await getAccounts();

  console.log(chalk.blue(`>>>>>>>>>>>> Network: ${(hre.network.config as any).url} <<<<<<<<<<<<`));
  console.log(chalk.blue(`>>>>>>>>>>>> Deployer: ${user.address} <<<<<<<<<<<<`));

  const UsdcToUsdAssimilator = await ethers.getContractFactory(ASSIMILATOR_CONTRACT_NAME_USDC);
  const EursToUsdAssimilator = await ethers.getContractFactory(ASSIMILATOR_CONTRACT_NAME_EURS);

  const usdcToUsdAssimilator = await deployContract({
    name: "UsdcToUsdAssimilator",
    deployer: user,
    factory: UsdcToUsdAssimilator,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  const eursToUsdAssimilator = await deployContract({
    name: "EursToUsdAssimilator",
    deployer: user,
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
  const outputLogDir = path.join(__dirname, `./deployed_contract_logs`);
  // Just like mkdir -p, it will create directory if it doesn't exist
  // If it already exists, then it will not print an error and will move further to create sub-directories.
  mkdirp.sync(outputLogDir);

  const timestamp = new Date().getTime().toString();
  const outputLogPath = path.join(`${outputLogDir}/${timestamp}_assimilators_deployed.json`);
  fs.writeFileSync(outputLogPath, JSON.stringify(output, null, 4));

  // Deployed contracts config
  const outputConfigPath = path.join(__dirname, '/config/assimilators_deployed.json');
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
