import hre from "hardhat";
const { ethers } = hre;

import { getAccounts, deployContract } from "./common";
import { deployedLogs, deployerHelper } from "./Utils";

async function main() {
  console.time('Deployment Time');
  const { user1 } = await getAccounts();
  let output = {};
  let newOutput = {};

  const coreContracts = process.env.CORE_CONTRACTS.split(',');
  for (let index = 0; index < coreContracts.length; index++) {
    try {
      const res = await deployerHelper(user1, coreContracts[index]);

      output[res.key] = res.address;
    } catch (error) {
      console.log(`Error: ${error}`);
      continue;
    }
  }

  Object.keys(output).map(key => newOutput[key[0].toUpperCase() + key.slice(1)] = output[key]);

  const CurveFactory = await ethers.getContractFactory("CurveFactory", {
    libraries: newOutput,
  });

  const curveFactory = await deployContract({
    name: "CurveFactory",
    deployer: user1,
    factory: CurveFactory,
    args: [],
    opts: {
      gasLimit: 4000000,
    },
  });

  const RouterFactory = await ethers.getContractFactory("Router");
  const router = await deployContract({
    name: "Router",
    deployer: user1,
    factory: RouterFactory,
    args: [curveFactory.address],
    opts: {
      gasLimit: 4000000,
    },
  });

  // Deployed contracts log
  await deployedLogs(hre.network.name, 'factory_deployed', {
    libraries: newOutput,
    curveFactory: curveFactory.address,
    router: router.address,
  });
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
