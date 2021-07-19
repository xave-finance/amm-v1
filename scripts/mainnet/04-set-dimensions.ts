require("dotenv").config();
import { ethers } from "hardhat";

import { Curve } from "../../typechain/Curve";
import { parseUnits } from "ethers/lib/utils";

// Weights are always 50/50

// Pool must respect a 10/90 ratio
// i.e. value of one pair cannot exceed 90% of the pools value
const ALPHA = parseUnits(process.env.DIMENSION_ALPHA);

// Slippage (fees) will that will be introduced when one of the tokens's ratio:
// - exceeds 75% of the pool value
// - goes under 25% of the pool value
const BETA = parseUnits(process.env.DIMENSION_BETA);
const MAX = parseUnits(process.env.DIMENSION_MAX);
const EPSILON = parseUnits(process.env.DIMENSION_EPSILON); // 5 basis point
const LAMBDA = parseUnits(process.env.DIMENSION_LAMBDA);

const CONTRACT_CURVE_EURS_ADDR = process.env.CONTRACT_CURVE_EURS_ADDR;

async function main() {
  const [deployer, user1] = await ethers.getSigners();

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await deployer.getAddress()}`);
  console.log(`Deployer balance: ${await deployer.getBalance()}`);
  console.log(`User1 account: ${await user1.getAddress()}`);
  console.log(`User1 balance: ${await user1.getBalance()}`);

  const curveEURS = (await ethers.getContractAt("Curve", CONTRACT_CURVE_EURS_ADDR)) as Curve;
  const txEURS = await curveEURS.setParams(ALPHA, BETA, MAX, EPSILON, LAMBDA, { gasLimit: 12000000 });
  await txEURS.wait();

  console.log(`Deployer balance: ${await deployer.getBalance()}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
