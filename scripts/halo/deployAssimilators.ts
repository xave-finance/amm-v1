import hre from "hardhat";
const { ethers } = hre;
import { getAccounts } from "../common";
import { configFileHelper, isArbitrumNetwork } from "../Utils";
import { deployContract } from "../common";
import fs from "fs";
import path from "path";
import { parseUnits } from "@ethersproject/units";

const NETWORK = hre.network.name;

async function main() {
  console.time("Deployment Time");
  const users = await getAccounts();
  const user = users[0];
  const contractName = "BaseToUsdAssimilator";
  let output = {};

  const assimilatorKeys = [
    'baseDecimals',
    'baseTokenAddress',
    'quoteTokenAddress',
    'oracleAddress'
  ];

  let assimilatorConfigs: {
    baseDecimals: number;
    baseTokenAddress: string;
    quoteTokenAddress: string;
    oracleAddress: string;
  }[] = [];
  const assimilatorPairs = process.env.ASSIMILATOR_PAIRS;
  const pairs = assimilatorPairs ? assimilatorPairs.split(",") : [];

  pairs.forEach(pair => {
    let data = fs.readFileSync(path.join(__dirname, `./assimilatorConfigs/${NETWORK}/${pair}.json`));
    let config = JSON.parse(data.toString());

    //Validate if config has all the properties
    for (const key of assimilatorKeys) {
      const configKeys = Object.keys(config)
      if (!configKeys.includes(key)) throw new Error(`${key} key doesn't exist in ${NETWORK}/${pair}.json`);
    }

    assimilatorConfigs.push(config);
  });

  for (let index = 0; index < assimilatorConfigs.length; index++) {
    const contractInstance = await ethers.getContractFactory(contractName);

    const deployed = await deployContract({
      name: contractName,
      deployer: user,
      factory: contractInstance,
      args: [
        parseUnits("1", assimilatorConfigs[index].baseDecimals),
        assimilatorConfigs[index].baseTokenAddress,
        assimilatorConfigs[index].quoteTokenAddress,
        assimilatorConfigs[index].oracleAddress,
      ],
    });

    const key = pairs[index].split("_")[0] + "ToUsdAssimilator";

    output[key] = deployed.address;
  }

  // Deployed contracts log
  await configFileHelper(output, "assimilators");
  console.timeEnd("Deployment Time");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
