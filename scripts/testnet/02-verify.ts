require("dotenv").config();
import { ethers } from "hardhat";
import { Signer } from "ethers";

const hre = require("hardhat")

export const getDeployer = async (): Promise<{
  deployer: Signer;
  user1: Signer;
  user2: Signer;
}> => {
  const [deployer, user1, user2] = await ethers.getSigners();
  return {
    deployer,
    user1,
    user2,
  };
};

const CONTRACT_CURVES_ADDR = process.env.CONTRACT_CURVES_ADDR;
const CONTRACT_ORCHESTRATOR_ADDR = process.env.CONTRACT_ORCHESTRATOR_ADDR;
const CONTRACT_PROPORTIONAL_LIQUIDITY_ADDR = process.env.CONTRACT_PROPORTIONAL_LIQUIDITY_ADDR;
const CONTRACT_SWAPS_ADDR = process.env.CONTRACT_SWAPS_ADDR;
const CONTRACT_VIEW_LIQUIDITY_ADDR = process.env.CONTRACT_VIEW_LIQUIDITY_ADDR;
const CONTRACT_CADCTOUSDASSIMILATOR_ADDR = process.env.CONTRACT_CADCTOUSDASSIMILATOR_ADDR;
const CONTRACT_USDCTOUSDASSIMILATOR_ADDR = process.env.CONTRACT_USDCTOUSDASSIMILATOR_ADDR;
const CONTRACT_EURSTOUSDASSIMILATOR_ADDR = process.env.CONTRACT_EURSTOUSDASSIMILATOR_ADDR;
const CONTRACT_XSGDTOUSDASSIMILATOR_ADDR = process.env.CONTRACT_XSGDTOUSDASSIMILATOR_ADDR;
const CONTRACT_CURVE_FACTORY_ADDR = process.env.CONTRACT_CURVE_FACTORY_ADDR;
const CONTRACT_ROUTER_ADDR = process.env.CONTRACT_ROUTER_ADDR;

async function main() {
  console.log('-------------------- Verifying Curves Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_CURVES_ADDR
  })

  console.log('-------------------- Verifying Orchestrator Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_ORCHESTRATOR_ADDR
  })

  console.log('-------------------- Verifying ProportionalLiquidity Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_PROPORTIONAL_LIQUIDITY_ADDR
  })

  console.log('-------------------- Verifying Swaps Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_SWAPS_ADDR
  })

  console.log('-------------------- Verifying ViewLiquidity Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_VIEW_LIQUIDITY_ADDR
  })

  console.log('-------------------- Verifying UsdcToUsdAssimilator Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_USDCTOUSDASSIMILATOR_ADDR
  })

  console.log('-------------------- Verifying EursToUsdAssimilator Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_EURSTOUSDASSIMILATOR_ADDR
  })

  console.log('-------------------- Verifying CurveFactory Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_CURVE_FACTORY_ADDR
  })

  console.log('-------------------- Verifying Router Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_ROUTER_ADDR,
    constructorArguments: [
      CONTRACT_CURVE_FACTORY_ADDR
    ]
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
