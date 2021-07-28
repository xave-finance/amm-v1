import hre from "hardhat";
import chalk from "chalk";
import { parseUnits } from "@ethersproject/units";

const { ethers } = hre;

import { CurveFactory, Curve } from "../../typechain";
import { getAccounts, getFastGasPrice } from "../common";
import { CONTRACTS } from "../config/contracts";

const TOKEN = {
  usdc: process.env.TOKEN_USDC,
  eurs: process.env.TOKEN_EURS
}

async function main() {
  const { user } = await getAccounts();

  console.log(chalk.blue(`>>>>>>>>>>>> Network: ${(hre.network.config as any).url} <<<<<<<<<<<<`));
  console.log(chalk.blue(`>>>>>>>>>>>> Deployer: ${user.address} <<<<<<<<<<<<`));

  const curveAddr = "0xD9533295Ed230B3F5F40dcaA157Ee27607eE9fAA";

  const curveEURS = (await ethers.getContractAt("Curve", curveAddr)) as Curve;

  const removeDerivative = await curveEURS
    .connect(user)
    .excludeDerivative(TOKEN.eurs)
    .then(x => x.wait());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
