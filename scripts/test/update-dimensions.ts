import hre from "hardhat";
import { parseUnits } from "@ethersproject/units";
const { ethers } = hre;

import { Curve } from "../../typechain";

const DIMENSION = {
  alpha: parseUnits(process.env.DIMENSION_ALPHA),
  beta: parseUnits(process.env.DIMENSION_BETA),
  max: parseUnits(process.env.DIMENSION_MAX),
  epsilon: parseUnits(process.env.DIMENSION_EPSILON),
  lambda: parseUnits(process.env.DIMENSION_LAMBDA)
}

async function main() {
  const curveAUD = (await ethers.getContractAt("Curve", "0x50d70784BBc9363408914Ab26d4897d469DD3DA1")) as Curve;
  const txAUD = await curveAUD.setParams(DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda, { gasLimit: 12000000 });
  await txAUD.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
