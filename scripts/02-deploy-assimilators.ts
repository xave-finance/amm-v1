import hre from "hardhat";
import chalk from "chalk";
const { ethers } = hre;

import { getAccounts } from "./common";
import { deployerHelper, assimConfig } from "./Utils";

const ASSIMILATORS = process.env.ASSIMILATORS;

async function main() {
  console.time('Deployment Time');
  const { user1 } = await getAccounts();
  let output = {};

  if (ASSIMILATORS.indexOf(',') > -1) {
    let assimilatorsArr = ASSIMILATORS.split(',');

    for (let index = 0; index < assimilatorsArr.length; index++) {
      const assimilator = assimilatorsArr[index];
      const res = await deployerHelper(user1, assimilator);

      output[res.key] = res.address;
    }
  } else {
    const res = await deployerHelper(user1, ASSIMILATORS);

    output[res.key] = res.address;
  }

  // Deployed contracts log
  for (var key in output) {
    let output = {};
    output[key] = output[key]
    await assimConfig(hre.network.name, key, output);
  }
  console.timeEnd('Deployment Time');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
