import hre from "hardhat";
import { parseUnits } from "@ethersproject/units";
const { ethers } = hre;

import { Curve } from "../../typechain";

import { curveImporter } from "../Utils";

const eursCurveAddr = require(curveImporter('curve_EURS_deployed')).curveAddress
const CONTRACT_CURVE_EURS_ADDR = eursCurveAddr;;

const DIMENSION = {
  alpha: parseUnits(process.env.DIMENSION_ALPHA),
  beta: parseUnits(process.env.DIMENSION_BETA),
  max: parseUnits(process.env.DIMENSION_MAX),
  epsilon: parseUnits(process.env.DIMENSION_EPSILON),
  lambda: parseUnits(process.env.DIMENSION_LAMBDA)
}

async function main() {
  const curveEURS = (await ethers.getContractAt("Curve", CONTRACT_CURVE_EURS_ADDR)) as Curve;
  const txAUD = await curveEURS.oq_setParams(
    DIMENSION.alpha,
    DIMENSION.beta,
    DIMENSION.max,
    DIMENSION.epsilon,
    DIMENSION.lambda, {
    gasLimit: 12000000
  });
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
