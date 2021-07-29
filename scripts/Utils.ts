import hre from "hardhat";
const { ethers } = hre;
import path from "path";
import mkdirp from "mkdirp";
import fs from "fs";

import { deployContract } from "./common";

export const deployedLogs = async (network, filename, output) => {
  // Deployed contracts log
  const outputLogDir = path.join(__dirname, `./deployed_contract_logs/${network}`);
  // Just like mkdir -p, it will create directory if it doesn't exist
  // If it already exists, then it will not print an error and will move further to create sub-directories.
  mkdirp.sync(outputLogDir);

  const timestamp = new Date().getTime().toString();
  const outputLogPath = path.join(`${outputLogDir}/${timestamp}_${filename}.json`);
  fs.writeFileSync(outputLogPath, JSON.stringify(output, null, 4));

  // Deployed contracts config
  const outputConfigDir = path.join(__dirname, `./config/${network}`);
  mkdirp.sync(outputConfigDir);
  const outputConfigPath = `/${outputConfigDir}/${filename}.json`;
  fs.writeFileSync(outputConfigPath, JSON.stringify(output, null, 4));
};

export const configImporter = (filename) => {
  return path.resolve(__dirname, `./config/${hre.network.name}/${filename}.json`);
}

export const assim = async (user, assim) => {
  const toUsdAssimilator = await ethers.getContractFactory(assim);

  const deployedAssimilator = await deployContract({
    name: assim,
    deployer: user,
    factory: toUsdAssimilator,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  // Lowercase the first letter of the key
  const key = assim[0].toLocaleLowerCase() + assim.slice(1);

  return {
    key,
    address: deployedAssimilator.address
  }
}