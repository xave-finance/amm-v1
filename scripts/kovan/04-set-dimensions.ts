require("dotenv").config();
import { ethers } from "hardhat";

import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { BigNumberish, Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";

const NAME = "DFX V1";
const SYMBOL = "DFX-V1";

// Weights are always 50/50

// Pool must respect a 10/90 ratio
// i.e. value of one pair cannot exceed 90% of the pools value
const ALPHA = parseUnits("0.8");

// Slippage (fees) will that will be introduced when one of the tokens's ratio:
// - exceeds 75% of the pool value
// - goes under 25% of the pool value
const BETA = parseUnits("0.5");

const MAX = parseUnits("0.15");
const EPSILON = parseUnits("0.0005"); // 5 basis point
const LAMBDA = parseUnits("0.3");

// Curve Contract Addresses
const CONTRACT_CURVE_AUD_ADDR = process.env.CONTRACT_CURVE_AUD_ADDR;
const CONTRACT_CURVE_CHF_ADDR = process.env.CONTRACT_CURVE_CHF_ADDR;
const CONTRACT_CURVE_EURS_ADDR = process.env.CONTRACT_CURVE_EURS_ADDR;
const CONTRACT_CURVE_GBP_ADDR = process.env.CONTRACT_CURVE_GBP_ADDR;
const CONTRACT_CURVE_JPY_ADDR = process.env.CONTRACT_CURVE_JPY_ADDR;
const CONTRACT_CURVE_KRW_ADDR = process.env.CONTRACT_CURVE_KRW_ADDR;
const CONTRACT_CURVE_PKR_ADDR = process.env.CONTRACT_CURVE_PKR_ADDR;

async function main() {
  const [deployer, user1] = await ethers.getSigners();

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await deployer.getAddress()}`);
  console.log(`Deployer balance: ${await deployer.getBalance()}`);
  console.log(`User1 account: ${await user1.getAddress()}`);
  console.log(`User1 balance: ${await user1.getBalance()}`);

  const curveAUD = (await ethers.getContractAt("Curve", CONTRACT_CURVE_AUD_ADDR)) as Curve;
  const txAUD = await curveAUD.setParams(ALPHA, BETA, MAX, EPSILON, LAMBDA, { gasLimit: 12000000 });
  await txAUD.wait();

  const curveCHF = (await ethers.getContractAt("Curve", CONTRACT_CURVE_CHF_ADDR)) as Curve;
  const txCHF = await curveCHF.setParams(ALPHA, BETA, MAX, EPSILON, LAMBDA, { gasLimit: 12000000 });
  await txCHF.wait();

  const curveEURS = (await ethers.getContractAt("Curve", CONTRACT_CURVE_EURS_ADDR)) as Curve;
  const txEURS = await curveEURS.setParams(ALPHA, BETA, MAX, EPSILON, LAMBDA, { gasLimit: 12000000 });
  await txEURS.wait();

  const curveGBP = (await ethers.getContractAt("Curve", CONTRACT_CURVE_GBP_ADDR)) as Curve;
  const txGBP = await curveGBP.setParams(ALPHA, BETA, MAX, EPSILON, LAMBDA, { gasLimit: 12000000 });
  await txGBP.wait();

  const curveJPY = (await ethers.getContractAt("Curve", CONTRACT_CURVE_JPY_ADDR)) as Curve;
  const txJPY = await curveJPY.setParams(ALPHA, BETA, MAX, EPSILON, LAMBDA, { gasLimit: 12000000 });
  await txJPY.wait();

  const curveKRW = (await ethers.getContractAt("Curve", CONTRACT_CURVE_KRW_ADDR)) as Curve;
  const txKRW = await curveKRW.setParams(ALPHA, BETA, MAX, EPSILON, LAMBDA, { gasLimit: 12000000 });
  await txKRW.wait();

  const curvePKR = (await ethers.getContractAt("Curve", CONTRACT_CURVE_PKR_ADDR)) as Curve;
  const txPKR = await curvePKR.setParams(ALPHA, BETA, MAX, EPSILON, LAMBDA, { gasLimit: 12000000 });
  await txPKR.wait();

  console.log('CurveAUD#setParams TX Hash: ', txAUD.hash);
  console.log('CurveCHF#setParams TX Hash: ', txCHF.hash);
  console.log('CurveEURS#setParams TX Hash: ', txEURS.hash);
  console.log('CurveGBP#setParams TX Hash: ', txGBP.hash);
  console.log('CurveJPY#setParams TX Hash: ', txJPY.hash);
  console.log('CurveKRW#setParams TX Hash: ', txKRW.hash);
  console.log('CurvePKR#setParams TX Hash: ', txPKR.hash);

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
