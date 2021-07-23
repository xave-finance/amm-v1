const hre = require("hardhat");

import { CONTRACTS } from "./config/contracts";
import * as zap from "./config/zap_deployed.json";

async function main() {
    console.log('-------------------- Verifying CORE_ADDRESSES.curves Contract');
    await hre.run('verify:verify', {
        address: CONTRACTS.curves
    })

    console.log('-------------------- Verifying CONTRACTS.orchestrator Contract');
    await hre.run('verify:verify', {
        address: CONTRACTS.orchestrator
    })

    console.log('-------------------- Verifying CONTRACTS.proportionalLiquidity Contract');
    await hre.run('verify:verify', {
        address: CONTRACTS.proportionalLiquidity
    })

    console.log('-------------------- Verifying CONTRACTS.swaps Contract');
    await hre.run('verify:verify', {
        address: CONTRACTS.swaps
    })

    console.log('-------------------- Verifying CONTRACTS.viewLiquidity Contract');
    await hre.run('verify:verify', {
        address: CONTRACTS.viewLiquidity
    })

    console.log('-------------------- Verifying CONTRACTS.factory Contract');
    await hre.run('verify:verify', {
        address: CONTRACTS.factory
    })

    console.log('-------------------- Verifying CONTRACTS.router Contract');
    await hre.run('verify:verify', {
        address: CONTRACTS.router,
        constructorArguments: [
            CONTRACTS.factory
        ]
    })

    console.log('-------------------- Verifying CONTRACTS.usdcToUsdAssimilator Contract');
    await hre.run('verify:verify', {
        address: CONTRACTS.usdcToUsdAssimilator
    })

    console.log('-------------------- Verifying CONTRACTS.eursToUsdAssimilator Contract');
    await hre.run('verify:verify', {
        address: CONTRACTS.eursToUsdAssimilator
    })

    console.log('-------------------- Verifying zap.zap Contract');
    await hre.run('verify:verify', {
        address: zap.zap
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