import path from "path";
import hre from "hardhat";
import { curveConfig, curveHelper } from "./Utils";
import { getAccounts } from "./common";
import chalk from "chalk";
import { formatUnits } from "ethers/lib/utils";

const NETWORK = hre.network.name;

const CURVE_PAIRS = process.env.CURVE_PAIRS;

async function main() {
  console.time('Deployment Time');
  const curves = CURVE_PAIRS.indexOf(",") > -1 ? CURVE_PAIRS.split(",") : [CURVE_PAIRS];

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