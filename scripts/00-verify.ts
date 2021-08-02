const hre = require("hardhat");
import { parseUnits } from "@ethersproject/units";
import { CONTRACTS } from "./config/contracts";
// import * as zap from "./config/zap_deployed.json";
import { configImporter } from "./Utils";


const eursCurveAddr = require(configImporter('curve_EURS_deployed')).curveAddress;

const ASSIMILATOR_ADDRESSES = {
    usdcToUsdAssimilator: CONTRACTS.usdcToUsdAssimilator,
    eursToUsdAssimilator: CONTRACTS.eursToUsdAssimilator,
};

const TOKEN = {
    usdc: process.env.TOKEN_USDC,
    eurs: process.env.TOKEN_EURS,
    cadc: process.env.TOKEN_CADC,
    xsgd: process.env.TOKEN_XSGD
}

async function main() {
    console.log('-------------------- Verifying eursCurveAddr Contract');

    const name = 'EURS Statis';
    const symbol = 'EURS';

    await hre.run('verify:verify', {
        address: eursCurveAddr,
        constructorArguments: [
            name,
            symbol,
            [
                TOKEN.eurs,
                ASSIMILATOR_ADDRESSES.eursToUsdAssimilator,
                TOKEN.eurs,
                ASSIMILATOR_ADDRESSES.eursToUsdAssimilator,
                TOKEN.eurs,
                TOKEN.usdc,
                ASSIMILATOR_ADDRESSES.usdcToUsdAssimilator,
                TOKEN.usdc,
                ASSIMILATOR_ADDRESSES.usdcToUsdAssimilator,
                TOKEN.usdc,
            ],
            [
                parseUnits("0.5"),
                parseUnits("0.5"),
            ]
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