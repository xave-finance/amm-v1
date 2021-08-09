import hre from "hardhat";

import { getAccounts } from "./common";
import { deployerHelper, configFileHelper } from "./Utils";

const ASSIMILATORS = process.env.ASSIMILATORS;

async function main() {
  console.time('Deployment Time');
  const { user1 } = await getAccounts();
  let output = {};
  let assimilators = ASSIMILATORS.indexOf(',') > -1 ? ASSIMILATORS.split(',') : [ASSIMILATORS];

  for (let index = 0; index < assimilators.length; index++) {
    const res = await deployerHelper(user1, assimilators[index]);

    output[res.key] = res.address;
  }

  // Deployed contracts log
  await configFileHelper(hre.network.name, output, 'assimilators');
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
