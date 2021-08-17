import hre from "hardhat";
import { curveConfig } from "./Utils";

const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL;
const TOKEN_NAME = process.env.TOKEN_NAME;
const CURVE_WEIGHTS = process.env.CURVE_WEIGHTS;

async function main() {
  console.time('Deployment Time');
  await curveConfig(TOKEN_SYMBOL, TOKEN_NAME, CURVE_WEIGHTS);
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
