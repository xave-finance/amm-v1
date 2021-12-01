import { ethers } from "hardhat";
import { getAccounts, deployContract } from "../common";
import { parseUnits } from "ethers/lib/utils";

async function main() {
  console.time("Deployment Time");

  const users = await getAccounts();
  const user1 = users[0];
  const MockAggregatorFactory = await ethers.getContractFactory("MockAggregator");

  const Oracle = await deployContract({
    name: "Mock PHP/USD Pricefeed",
    deployer: user1,
    factory: MockAggregatorFactory,
    args: [],
  });

  const amount = parseUnits("50.34", 18); // PHP rate

  await Oracle.setAnswer(amount);

  console.timeEnd("Deployment Time");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
