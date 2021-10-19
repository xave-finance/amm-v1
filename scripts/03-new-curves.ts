import hre from "hardhat";
import { curveConfig } from "./Utils";
import { getAccounts } from "./common";
import chalk from "chalk";
import { formatUnits } from "ethers/lib/utils";

const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL;
const TOKEN_NAME = process.env.TOKEN_NAME;
const CURVE_WEIGHTS = process.env.CURVE_WEIGHTS;
const LPT_NAME = process.env.LPT_NAME;

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const balance = await user1.getBalance();
  console.log(chalk.blueBright(`Deployer balance: ${formatUnits(balance)} ETH`));

  try {
    await curveConfig(TOKEN_SYMBOL, TOKEN_NAME, CURVE_WEIGHTS, LPT_NAME);
  } catch (error) {
    console.log(`Error: ${error}`);
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
