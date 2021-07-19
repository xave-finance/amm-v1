const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.localhost') });

import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { getFutureTime } from "../../test/Utils";
import { parseEther, formatUnits } from "ethers/lib/utils";
import { ERC20 } from "../../typechain/ERC20";

const CONTRACT_CURVE_EURS_ADDR = process.env.CONTRACT_CURVE_EURS_ADDR;
const TOKEN_USDC = process.env.TOKENS_USDC_ADDR;
const TOKEN_EURS = process.env.TOKENS_EURS_ADDR;
const TOKENS_EURS_DECIMALS = process.env.TOKENS_EURS_DECIMALS;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await deployer.getAddress()}`);
  console.log(`Deployer balance: ${await deployer.getBalance()}`);

  const usdc = (await ethers.getContractAt("ERC20", TOKEN_USDC)) as ERC20;
  const eurs = (await ethers.getContractAt("ERC20", TOKEN_EURS)) as ERC20;
  const curveEURS = (await ethers.getContractAt("Curve", CONTRACT_CURVE_EURS_ADDR)) as Curve;

  const viewCurveSwapEURS = await curveEURS
    .connect(deployer)
    .viewOriginSwap(eurs.address, usdc.address, "5");
  console.log('View Origin Swap: ', formatUnits(viewCurveSwapEURS, TOKENS_EURS_DECIMALS));

  // const viewCurveSwapEURS = await curveEURS
  //   .connect(deployer)
  //   .getOriginSwapData(eurs.address, usdc.address, "5");
  // input, output, assim, amt
  // getOriginSwapData(curve, _o.ix, _t.ix, _o.addr, _originAmount);

  const eurAmt = parseEther("1");
  console.log(`Swapping ${eurAmt} EUR to USDC`);

  const eursBefore = await eurs.balanceOf(await deployer.getAddress());
  console.log("Before EURS bal", eursBefore.toString());

  await curveEURS
    .connect(deployer)
    .originSwap(eurs.address, usdc.address, "1", 0, await getFutureTime(), {
      gasLimit: 3000000,
    });

  const eursAfter = await eurs.balanceOf(await deployer.getAddress());
  console.log("After EURS bal", eursAfter.toString());
  console.log(`Deployer balance: ${await deployer.getBalance()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
