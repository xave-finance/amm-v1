import { ethers } from "hardhat";
import { getAccounts, deployContract } from "../common";
import { parseUnits } from "ethers/lib/utils";

async function main() {
  console.time("Deployment Time");

  const users = await getAccounts();
  const user1 = users[0];
  const MockTokenFactory = await ethers.getContractFactory("MockToken");

  const Token = await deployContract({
    name: "ERC20",
    deployer: user1,
    factory: MockTokenFactory,
    //args: ["Mock XIDR", "XIDR", 6],
    args: ["Mock fxPHP", "fxPHP", 18],
  });

  await Token.mint(user1.address, parseUnits("1000000000"));

  console.timeEnd("Deployment Time");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
