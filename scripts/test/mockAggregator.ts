import { ethers } from "hardhat";
import { getAccounts, deployContract, getFastGasPrice } from "../common";
import { parseUnits } from "ethers/lib/utils";

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const AggFactory = await ethers.getContractFactory("MockAggregator",);

  const aggregator = await deployContract({
    name: "MockAggregator",
    deployer: user1,
    factory: AggFactory,
    args: [],
    opts: {
      gasLimit: 4000000,
      gasPrice: parseUnits("150", 9)
    },
  });

  console.log("aggregator: ", aggregator.address);

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