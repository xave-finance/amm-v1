import hre from "hardhat";
import chalk from "chalk";

import { TOKENS } from "../test/Constants";
import { CurveFactory, Curve } from "../typechain";
import { getAccounts, getFastGasPrice } from "./common";
import { parseUnits } from "@ethersproject/units";
import { CONTRACTS } from "./contracts";

const { ethers } = hre;

const GOVERNANCE = "0x27e843260c71443b4cc8cb6bf226c3f77b9695af";

// const ASSIMILATOR_ADDRESSES = {
//   cadcToUsdAssimilator: "0x9fd244e5972F28e2F133bd3dAA5A6691C8E6d1c7",
//   usdcToUsdAssimilator: "0xA31Ea4553E82e08b3F411B29C009ECd45AE1738B",
//   eursToUsdAssimilator: "0x0534B3647623EB050541700810A070C2Df06F977",
//   xsgdToUsdAssimilator: "0x31799946e72a44273515556e366e059064Df8ca2",
// };
const ASSIMILATOR_ADDRESSES = {
  cadcToUsdAssimilator: CONTRACTS.cadcToUsdAssimilator,
  usdcToUsdAssimilator: CONTRACTS.usdcToUsdAssimilator,
  eursToUsdAssimilator: CONTRACTS.eursToUsdAssimilator,
  xsgdToUsdAssimilator: CONTRACTS.xsgdToUsdAssimilator,
};
console.log("ASSIMILATOR_ADDRESSES: ", ASSIMILATOR_ADDRESSES);

const ALPHA = parseUnits("0.8");
const BETA = parseUnits("0.5");
const MAX = parseUnits("0.15");
const EPSILON = parseUnits("0.0005");
const LAMBDA = parseUnits("0.3");

async function main() {
  const { user } = await getAccounts();

  console.log(chalk.blue(`>>>>>>>>>>>> Network: ${(hre.network.config as any).url} <<<<<<<<<<<<`));
  console.log(chalk.blue(`>>>>>>>>>>>> Deployer: ${user.address} <<<<<<<<<<<<`));

  console.log("CurveFactory ", CONTRACTS.factory);
  const curveFactory = (await ethers.getContractAt("CurveFactory", CONTRACTS.factory)) as CurveFactory;

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
    const tx2 = await curve.setParams(ALPHA, BETA, MAX, EPSILON, LAMBDA, {
      gasPrice,
      gasLimit: 300000,
    });
    console.log("tx hash", tx2.hash);
    await tx2.wait();
    console.log("params setted, transferring ownership");
    gasPrice = await getFastGasPrice();
    const tx3 = await curve.transferOwnership(GOVERNANCE, {
      gasPrice,
      gasLimit: 300000,
    });
    console.log("tx hash", tx3.hash);
    await tx3.wait();
    console.log("ownership xferred");

    console.log("==== done ====");
  };

  await createAndSetParams(
    "dfx-cadc-usdc-a",
    "dfx-cadc-a",
    TOKENS.CADC.address,
    TOKENS.USDC.address,
    ASSIMILATOR_ADDRESSES.cadcToUsdAssimilator,
    ASSIMILATOR_ADDRESSES.usdcToUsdAssimilator,
  );

  await createAndSetParams(
    "dfx-eurs-usdc-a",
    "dfx-eurs-a",
    TOKENS.EURS.address,
    TOKENS.USDC.address,
    ASSIMILATOR_ADDRESSES.eursToUsdAssimilator,
    ASSIMILATOR_ADDRESSES.usdcToUsdAssimilator,
  );

  await createAndSetParams(
    "dfx-xsgd-usdc-a",
    "dfx-xsgd-a",
    TOKENS.XSGD.address,
    TOKENS.USDC.address,
    ASSIMILATOR_ADDRESSES.xsgdToUsdAssimilator,
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
