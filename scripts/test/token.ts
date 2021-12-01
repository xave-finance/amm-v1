import { ethers } from "hardhat";
import { getAccounts, deployContract, getFastGasPrice } from "../common";
import { parseUnits } from "ethers/lib/utils";

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const TokenFactory = await ethers.getContractFactory("MockToken",);

  // const lfxaud = await deployContract({
  //   name: "ERC20",
  //   deployer: user1,
  //   factory: TokenFactory,
  //   args: ["LolliDAO AUD", "lfxAUD", 18],
  //   opts: {
  //     gasLimit: 4000000,
  //     gasPrice: parseUnits("150", 9)
  //   },
  // });

  const lfxaud = "0xC8d1AeC01DB97EdFd66a5B91136EC34068fE917a";
  const arr = [lfxaud];

  for (let index = 0; index < arr.length; index++) {
    const row = arr[index];

    const token = row;
    const contract = await (await ethers.getContractFactory("MockToken")).attach(token);

    const gasPrice = await getFastGasPrice();
    const mint = await (await contract.mint(user1.address, parseUnits("99000000"), {
      gasLimit: 4000000,
      gasPrice: parseUnits("150", 9)
    }));
    console.log("mint", mint.hash);
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