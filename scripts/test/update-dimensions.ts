import hre from "hardhat";
import { parseUnits } from "@ethersproject/units";
const { ethers } = hre;

import { Curve } from "../../typechain";

import { curveImporter } from "../Utils";
import { CONFIG } from "../../test/Config"

const eursCurveAddr = require(curveImporter('curve_EURS_deployed')).curveAddress
const CONTRACT_CURVE_EURS_ADDR = eursCurveAddr;;

const DIMENSION = {
  alpha: parseUnits(CONFIG.DIMENSION_ALPHA),
  beta: parseUnits(CONFIG.DIMENSION_BETA),
  max: parseUnits(CONFIG.DIMENSION_MAX),
  epsilon: parseUnits(CONFIG.DIMENSION_EPSILON),
  lambda: parseUnits(CONFIG.DIMENSION_LAMBDA)
}

async function main() {
  const curveEURS = (await ethers.getContractAt("Curve", CONTRACT_CURVE_EURS_ADDR)) as Curve;
  const txAUD = await curveEURS.setParams(
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
