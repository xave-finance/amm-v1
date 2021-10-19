import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { getAccounts, getFastGasPrice } from "../common";
import { curveAddresses } from "../Utils";
import chalk from "chalk";
import { formatUnits } from "ethers/lib/utils";

const GOVERNANCE_ADDRESS = process.env.GOVERNANCE_ADDRESS;

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const balance = await user1.getBalance();
  console.log(chalk.blueBright(`Deployer balance: ${formatUnits(balance)} ETH`));
  const curves = await curveAddresses();
  const TOKEN = 'XSGD';
  const curve = (await ethers.getContractAt("Curve", curves[TOKEN])) as Curve;
  const gasPrice = await getFastGasPrice();

  try {
    // Change ownership
    console.log('\r');
    const tx = await curve.transferOwnership(GOVERNANCE_ADDRESS, { gasPrice });
    console.log("tx hash", tx.hash);
    await tx.wait();
    console.log(`${TOKEN} ownership xferred`);

    console.timeEnd('Deployment Time');
  } catch (error) {
    console.log(error);
    console.timeEnd('Deployment Time');
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });