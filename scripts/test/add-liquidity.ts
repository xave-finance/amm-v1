import { ethers } from "hardhat";
import { parseUnits, formatUnits } from "ethers/lib/utils";

import { getFutureTime } from "../../test/Utils";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { getAccounts } from "../common";
import { curveImporter } from "../Utils";

const eursCurveAddr = require(curveImporter('curve_EURS_deployed')).curveAddress;

const CONTRACT_CURVE_EURS_ADDR = eursCurveAddr;
const TOKEN_USDC = process.env.TOKEN_USDC;
const TOKEN_EURS = process.env.TOKEN_EURS;
const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
const TOKENS_EURS_DECIMALS = process.env.TOKENS_EURS_DECIMALS;

async function main() {
  const { user1 } = await getAccounts();
  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;

  // Approve tokens
  await erc20.attach(TOKEN_USDC).connect(user1)
    .approve(CONTRACT_CURVE_EURS_ADDR, parseUnits("10000000", TOKENS_USDC_DECIMALS));
  await erc20.attach(TOKEN_EURS).connect(user1)
    .approve(CONTRACT_CURVE_EURS_ADDR, parseUnits("10000000", TOKENS_EURS_DECIMALS));

  const amt = parseUnits("10000");
  const curveEURS = (await ethers.getContractAt("Curve", CONTRACT_CURVE_EURS_ADDR)) as Curve;
  const eurs = (await ethers.getContractAt("ERC20", TOKEN_EURS)) as ERC20;
  const usdc = (await ethers.getContractAt("ERC20", TOKEN_USDC)) as ERC20;

  const eursBalBefore = formatUnits(await eurs.balanceOf(user1.address), TOKENS_EURS_DECIMALS);
  const usdcBalBefore = formatUnits(await usdc.balanceOf(user1.address), TOKENS_USDC_DECIMALS);
  const eursAllowanceBefore = formatUnits(await eurs.allowance(user1.address, CONTRACT_CURVE_EURS_ADDR), TOKENS_EURS_DECIMALS);
  const usdcAllowanceBefore = formatUnits(await usdc.allowance(user1.address, CONTRACT_CURVE_EURS_ADDR), TOKENS_USDC_DECIMALS);

  console.log('BASE Amout to Deposit: ', formatUnits(amt));
  console.log('EURS Bal Before: ', eursBalBefore);
  console.log('USDC Bal Before: ', usdcBalBefore);
  console.log('EURS Allowance Before: ', eursAllowanceBefore);
  console.log('USDC Allowance Before: ', usdcAllowanceBefore);

  const [lpAmountUser1, [baseViewUser1, quoteViewUser1]] = await curveEURS.viewDeposit(amt);

  console.log('-----------------------------------------------------------------------');
  console.log('Liquidity To Deposit');
  console.log('-----------------------------------------------------------------------');
  console.log('EURS AMT: ', formatUnits(baseViewUser1, TOKENS_EURS_DECIMALS));
  console.log('USDC AMT: ', formatUnits(quoteViewUser1, TOKENS_USDC_DECIMALS));

  // Supply liquidity to the pools
  const depositCurveEURS = await curveEURS
    .deposit(amt, await getFutureTime(), { gasLimit: 12000000 })
    .then(x => x.wait());

  console.log('depositCurveEURS', depositCurveEURS);

  // Check pool liquidity
  const [lpAmount, [baseBal, quoteBal]] = await curveEURS
    .liquidity();
  console.log('-----------------------------------------------------------------------');
  console.log('Liquidity Balance');
  console.log('-----------------------------------------------------------------------');

  console.log('Total: ', formatUnits(lpAmount));
  console.log('EURS: ', formatUnits(baseBal, TOKENS_EURS_DECIMALS));
  console.log('USDC: ', formatUnits(quoteBal, TOKENS_USDC_DECIMALS));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });