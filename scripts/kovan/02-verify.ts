const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.kovan') });

const hre = require("hardhat");

// Core Contracts
const CONTRACT_CORE_CURVES_ADDR = process.env.CONTRACT_CORE_CURVES_ADDR;
const CONTRACT_CORE_ORCHESTRATOR_ADDR = process.env.CONTRACT_CORE_ORCHESTRATOR_ADDR;
const CONTRACT_CORE_PROPORTIONAL_LIQUIDITY_ADDR = process.env.CONTRACT_CORE_PROPORTIONAL_LIQUIDITY_ADDR;
const CONTRACT_CORE_SWAPS_ADDR = process.env.CONTRACT_CORE_SWAPS_ADDR;
const CONTRACT_CORE_VIEW_LIQUIDITY_ADDR = process.env.CONTRACT_CORE_VIEW_LIQUIDITY_ADDR;
const CONTRACT_CORE_CURVE_FACTORY_ADDR = process.env.CONTRACT_CORE_CURVE_FACTORY_ADDR;
const CONTRACT_CORE_ROUTER_ADDR = process.env.CONTRACT_CORE_ROUTER_ADDR;

// Assimilator Contracts
const CONTRACT_ASSIMILATOR_AUDTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_AUDTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_CHFTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_CHFTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_GBPTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_GBPTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_JPYTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_JPYTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_KRWTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_KRWTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_PKRTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_PKRTOUSD_ADDR;
const CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR = process.env.CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR;

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

  console.log('-------------------- Verifying CONTRACT_ASSIMILATOR_AUDTOUSD_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_ASSIMILATOR_AUDTOUSD_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_ASSIMILATOR_CHFTOUSD_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_ASSIMILATOR_CHFTOUSD_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_ASSIMILATOR_EURSTOUSD_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_ASSIMILATOR_GBPTOUSD_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_ASSIMILATOR_GBPTOUSD_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_ASSIMILATOR_JPYTOUSD_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_ASSIMILATOR_JPYTOUSD_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_ASSIMILATOR_KRWTOUSD_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_ASSIMILATOR_KRWTOUSD_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_ASSIMILATOR_PKRTOUSD_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_ASSIMILATOR_PKRTOUSD_ADDR
  })

  console.log('-------------------- Verifying CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR Contract');
  await hre.run('verify:verify', {
    address: CONTRACT_ASSIMILATOR_USDCTOUSD_ADDR
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
