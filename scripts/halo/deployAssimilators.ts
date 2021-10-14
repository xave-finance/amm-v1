import hre from "hardhat";
const { ethers } = hre;
import { getAccounts } from "../common";
import { configFileHelper } from "../Utils";
import { deployContract } from "../common";
import fs from "fs";
import path from "path";
import { parseUnits } from "@ethersproject/units";

async function main() {
  console.time("Deployment Time");
  const users = await getAccounts();
  const user = users[0];
  const contractName = "BaseToUsdAssimilator";
  let output = {};

  let assimilatorConfigs: {
    baseDecimals: number;
    baseTokenAddress: string;
    quoteTokenAddress: string;
    oracleAddress: string;
  }[] = [];
  const assimilatorPairs = process.env.ASSIMILATOR_PAIRS;
  const pairs = assimilatorPairs ? assimilatorPairs.split(",") : [];

  pairs.forEach(pair => {
    let data = fs.readFileSync(path.join(__dirname, `./assimilatorConfigs/${pair}.json`));
    let config = JSON.parse(data.toString());
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
      opts: {
        gasLimit: 3000000,
      },
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
