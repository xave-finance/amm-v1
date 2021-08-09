import hre from "hardhat";
const { ethers } = hre;
import path from "path";
import mkdirp from "mkdirp";
import fs from "fs";

import { deployContract } from "./common";

export const assimConfig = async (network, filename, output) => {
  // Deployed contracts config
  const outputConfigDir = path.join(__dirname, `./config/${network}/assimilators`);
  mkdirp.sync(outputConfigDir);

  const outputConfigPath = `/${outputConfigDir}/${filename}.json`;
  fs.writeFileSync(outputConfigPath, JSON.stringify(output, null, 4));
}

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

export const deployerHelper = async (user, contractName) => {
  const contractInstance = await ethers.getContractFactory(contractName);

  const deployed = await deployContract({
    name: contractName,
    deployer: user,
    factory: contractInstance,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  // Lowercase the first letter of the key
  const key = contractName[0].toLocaleLowerCase() + contractName.slice(1);

  return {
    key,
    address: deployed.address
  }
}