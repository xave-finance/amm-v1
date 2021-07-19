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

const CONTRACT_CORE_CURVES_ADDR = process.env.CONTRACT_CORE_CURVES_ADDR;
const CONTRACT_CORE_ORCHESTRATOR_ADDR = process.env.CONTRACT_CORE_ORCHESTRATOR_ADDR;
const CONTRACT_CORE_PROPORTIONAL_LIQUIDITY_ADDR = process.env.CONTRACT_CORE_PROPORTIONAL_LIQUIDITY_ADDR;
const CONTRACT_CORE_SWAPS_ADDR = process.env.CONTRACT_CORE_SWAPS_ADDR;
const CONTRACT_CORE_VIEW_LIQUIDITY_ADDR = process.env.CONTRACT_CORE_VIEW_LIQUIDITY_ADDR;
const CONTRACT_CORE_CURVE_FACTORY_ADDR = process.env.CONTRACT_CORE_CURVE_FACTORY_ADDR;
const CONTRACT_CORE_ROUTER_ADDR = process.env.CONTRACT_CORE_ROUTER_ADDR;

const CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR;

async function main() {
  console.log('-------------------- Verifying CONTRACT_CORE_CURVES_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_CORE_CURVES_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_CORE_ORCHESTRATOR_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_CORE_ORCHESTRATOR_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_CORE_PROPORTIONAL_LIQUIDITY_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_CORE_PROPORTIONAL_LIQUIDITY_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_CORE_SWAPS_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_CORE_SWAPS_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_CORE_VIEW_LIQUIDITY_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_CORE_VIEW_LIQUIDITY_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_CORE_CURVE_FACTORY_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_CORE_CURVE_FACTORY_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_CORE_ROUTER_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_CORE_ROUTER_ADDR,
    constructorArguments: [
      CONTRACT_CORE_CURVE_FACTORY_ADDR
    ]
  })

  console.log('-------------------- Verifying CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR
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
