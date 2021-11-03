import { curveHelper } from "./Utils";
import { formatUnits } from "ethers/lib/utils";
import chalk from "chalk";
import { getAccounts } from "./common";

const ASSIMILATOR_PAIRS = process.env.ASSIMILATOR_PAIRS;

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const balance = await user1.getBalance();
  console.log(chalk.blueBright(`Deployer balance: ${formatUnits(balance)} ETH`));
  const curves = ASSIMILATOR_PAIRS.indexOf(",") > -1 ? ASSIMILATOR_PAIRS.split(",") : [ASSIMILATOR_PAIRS];

  try {
    await curveHelper(curves);
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