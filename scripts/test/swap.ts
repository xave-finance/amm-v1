import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { Router } from "../../typechain/Router";
import { ERC20 } from "../../typechain/ERC20";
import { parseUnits, formatUnits, formatEther } from "ethers/lib/utils";
import { getAccounts } from "../common";

import { getFutureTime } from "../../test/Utils";
import { configImporter } from "../Utils";
import { use } from "chai";

const eursCurveAddr = require(configImporter('curve_EURS_deployed')).curveAddress;
const routerAddr = require(configImporter('factory_deployed')).router;

const CONTRACT_CURVE_EURS_ADDR = eursCurveAddr;
const ROUTER_ADDR = routerAddr;
const TOKEN_USDC = process.env.TOKEN_USDC;
const TOKEN_EURS = process.env.TOKEN_EURS;
const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
const TOKENS_EURS_DECIMALS = process.env.TOKENS_EURS_DECIMALS;

async function main() {
  const { user1 } = await getAccounts();

  const usdc = (await ethers.getContractAt("ERC20", TOKEN_USDC)) as ERC20;
  const eurs = (await ethers.getContractAt("ERC20", TOKEN_EURS)) as ERC20;
  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;
  const curveEURS = (await ethers.getContractAt("Curve", CONTRACT_CURVE_EURS_ADDR)) as Curve;
  const router = (await ethers.getContractAt("Router", ROUTER_ADDR)) as Router;

  await erc20.attach(TOKEN_EURS).connect(user1)
    .approve(CONTRACT_CURVE_EURS_ADDR, parseUnits("10000000", TOKENS_EURS_DECIMALS));

  const amt = parseUnits("34", TOKENS_EURS_DECIMALS);
  const eursBalBefore = await erc20.attach(eurs.address).balanceOf(user1.address);
  const usdcBalBefore = await erc20.attach(usdc.address).balanceOf(user1.address);
  const eursAllowanceBefore = await eurs.allowance(user1.address, CONTRACT_CURVE_EURS_ADDR);

  console.log('Amount From: ', formatUnits(amt, TOKENS_EURS_DECIMALS));
  console.log('\r');
  console.log(`EURS Balance Before: `, formatUnits(eursBalBefore, TOKENS_EURS_DECIMALS));
  console.log(`USDC Balance Before: `, formatUnits(usdcBalBefore, TOKENS_USDC_DECIMALS));
  console.log('EURS Allowance Before: ', formatUnits(eursAllowanceBefore, TOKENS_EURS_DECIMALS));

  const viewRouterSwapEURS = await curveEURS
    .connect(user1)
    .viewOriginSwap(eurs.address, usdc.address, amt);

  await curveEURS
    .connect(user1)
    .originSwap(eurs.address, usdc.address, amt, 0, await getFutureTime(), {
      gasLimit: 3000000,
    });
  const eursBalAfter = await erc20.attach(eurs.address).balanceOf(user1.address);
  const usdcBalAfter = await erc20.attach(usdc.address).balanceOf(user1.address);

  console.log('\r');
  console.log('Origin Swap Amount To (contract): ', formatUnits(viewRouterSwapEURS, TOKENS_USDC_DECIMALS));
  console.log('\r');
  console.log(`EURS Balance After: `, formatUnits(eursBalAfter, TOKENS_EURS_DECIMALS));
  console.log(`USDC Balance After: `, formatUnits(usdcBalAfter, TOKENS_USDC_DECIMALS));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });