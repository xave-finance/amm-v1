import { ethers } from "hardhat";
import { getAccounts, deployContract } from "../common";
import { formatUnits, parseUnits } from "ethers/lib/utils";

async function main() {
  console.time("Deployment Time");

  const users = await getAccounts();
  const user1 = users[0];
  const MockAggregatorFactory = await ethers.getContractFactory("MockAggregator");

  const Oracle = await deployContract({
    name: "Mock XIDR/USD Pricefeed",
    deployer: user1,
    factory: MockAggregatorFactory,
    args: [],
  });

  const amount = parseUnits("0.020", 8); // PHP rate (1 PHP = 0.020 USD)
  // const amount = parseUnits("0.000070", 8); // IDR rate (1 IDR = 0.000070 USD)

  await Oracle.setAnswer(amount);

  console.timeEnd("Deployment Time");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
