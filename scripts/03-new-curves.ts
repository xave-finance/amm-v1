import hre from "hardhat";
import chalk from "chalk";
import { parseUnits } from "@ethersproject/units";

const { ethers } = hre;

import { CurveFactory, Curve } from "../typechain";
import { getAccounts, getFastGasPrice } from "./common";
import { CONTRACTS } from "./config/contracts";

const CORE_ADDRESSES = {
  curveFactory: CONTRACTS.factory
}

const ASSIMILATOR_ADDRESSES = {
  usdcToUsdAssimilator: CONTRACTS.usdcToUsdAssimilator,
  eursToUsdAssimilator: CONTRACTS.eursToUsdAssimilator,
};

const GOVERNANCE_ADDRESS = process.env.GOVERNANCE_ADDRESS;

const DIMENSION = {
  alpha: parseUnits(process.env.DIMENSION_ALPHA),
  beta: parseUnits(process.env.DIMENSION_BETA),
  max: parseUnits(process.env.DIMENSION_MAX),
  epsilon: parseUnits(process.env.DIMENSION_EPSILON),
  lambda: parseUnits(process.env.DIMENSION_LAMBDA)
}

const TOKEN = {
  usdc: process.env.TOKEN_USDC,
  eurs: process.env.TOKEN_EURS
}

async function main() {
  const { user } = await getAccounts();

  console.log(chalk.blue(`>>>>>>>>>>>> Network: ${(hre.network.config as any).url} <<<<<<<<<<<<`));
  console.log(chalk.blue(`>>>>>>>>>>>> Deployer: ${user.address} <<<<<<<<<<<<`));

  const curveFactory = (await ethers.getContractAt(
    "CurveFactory",
    CORE_ADDRESSES.curveFactory,
  )) as CurveFactory;

  const createAndSetParams = async (name, symbol, base, quote, baseAssim, quoteAssim) => {
    console.log("creating ", name);
    let gasPrice = await getFastGasPrice();
    console.log("gasPrice set to ", ethers.utils.formatEther(gasPrice));
    console.log("curveFactory owner is ", await curveFactory.owner());
    const tx = await curveFactory.newCurve(
      name,
      symbol,
      base,
      quote,
      parseUnits("0.5"),
      parseUnits("0.5"),
      baseAssim,
      quoteAssim,
      {
        gasPrice,
        gasLimit: 3300000,
      },
    );
    console.log("tx hash", tx.hash);
    const txRecp = await tx.wait();
    const newCurveAddress = txRecp.events.filter(x => x.event === "NewCurve")[0].args.curve;
    console.log("new curve", newCurveAddress);

    const curve = (await ethers.getContractAt("Curve", newCurveAddress)) as Curve;
    console.log("setting params");
    gasPrice = await getFastGasPrice();
    const tx2 = await curve.setParams(
      DIMENSION.alpha,
      DIMENSION.beta,
      DIMENSION.max,
      DIMENSION.epsilon,
      DIMENSION.lambda, {
      gasPrice,
      gasLimit: 300000,
    }
    );
    console.log("tx hash", tx2.hash);
    await tx2.wait();
    console.log("params setted, transferring ownership");
    gasPrice = await getFastGasPrice();

    const tx3 = await curve.transferOwnership(GOVERNANCE_ADDRESS, {
      gasPrice,
      gasLimit: 300000,
    });
    console.log("tx hash", tx3.hash);
    await tx3.wait();
    console.log("ownership xferred");

    console.log("==== done ====");
  };

  await createAndSetParams(
    "dfx-eurs-usdc-a",
    "dfx-eurs-a",
    TOKEN.eurs,
    TOKEN.usdc,
    ASSIMILATOR_ADDRESSES.eursToUsdAssimilator,
    ASSIMILATOR_ADDRESSES.usdcToUsdAssimilator,
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
