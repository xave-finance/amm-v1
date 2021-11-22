import { ethers } from "hardhat";
import { parseUnits } from "@ethersproject/units";
import { Curve } from "../../typechain/Curve";
import { getAccounts, getFastGasPrice } from "../common";
import { curveAddresses } from "../Utils";
import { CONFIG } from "../../test/Config"

const DIMENSION = {
  alpha: parseUnits(CONFIG.DIMENSION_ALPHA),
  beta: parseUnits(CONFIG.DIMENSION_BETA),
  max: parseUnits(CONFIG.DIMENSION_MAX),
  epsilon: parseUnits(CONFIG.DIMENSION_EPSILON),
  lambda: parseUnits(CONFIG.DIMENSION_LAMBDA)
}

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const curves = await curveAddresses();
  const TOKEN = 'XSGD';
  const curve = (await ethers.getContractAt("Curve", curves[TOKEN])) as Curve;

  try {
    console.log('\r');

    try {
      const gasPrice = await getFastGasPrice();
      const tx = await curve.setParams(
        DIMENSION.alpha,
        DIMENSION.beta,
        DIMENSION.max,
        DIMENSION.epsilon,
        DIMENSION.lambda, { gasPrice });
      console.log('Curve#setParams TX Hash: ', tx.hash)

      await tx.wait();
    } catch (error) {
      console.log(`Error: ${error}`);
    }

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