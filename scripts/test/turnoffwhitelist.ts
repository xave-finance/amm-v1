import { ethers } from "hardhat";
import { parseUnits, formatUnits } from "ethers/lib/utils";
import { BigNumberish, Signer } from "ethers";
import hre from "hardhat";

import { mintEURS, mintUSDC, getFutureTime } from "../../test/Utils";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { getAccounts } from "../common";
import { configImporter } from "../Utils";

const eursCurveAddr = require(configImporter('curve_EURS_deployed')).curveAddress;

const CONTRACT_CURVE_EURS_ADDR = eursCurveAddr;


async function main() {
  console.time('Deployment Time');

  const curveEURS = (await ethers.getContractAt("Curve", CONTRACT_CURVE_EURS_ADDR)) as Curve;

  try {
    const turnOffWhitelisting = await curveEURS.turnOffWhitelisting();
    console.log('Curve#turnOffWhitelisting TX Hash: ', turnOffWhitelisting.hash)
    console.timeEnd('Deployment Time');
  } catch (error) {
    console.log(error);
    console.timeEnd('Deployment Time');
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });