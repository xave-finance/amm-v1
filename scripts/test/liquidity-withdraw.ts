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
const TOKEN_USDC = process.env.TOKEN_USDC;
const TOKEN_EURS = process.env.TOKEN_EURS;
const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
const TOKENS_EURS_DECIMALS = process.env.TOKENS_EURS_DECIMALS;

async function main() {
  console.time('Deployment Time');
  const { user1 } = await getAccounts();
  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;

  // Approve tokens
  const mintAndApprove = async function (
    tokenAddress: string,
    minter: Signer,
    amount: BigNumberish,
    recipient: string,
  ) {
    const minterAddress = await minter.getAddress();

    if (hre.network.name === 'localhost') {
      if (tokenAddress.toLowerCase() === TOKEN_USDC.toLowerCase()) {
        await mintUSDC(minterAddress, amount);
      }

      if (tokenAddress.toLowerCase() === TOKEN_EURS.toLowerCase()) {
        await mintEURS(minterAddress, amount);
      }
    }

    await erc20.attach(tokenAddress).connect(minter).approve(recipient, amount);
  };

  const multiMintAndApprove = async function (requests: [string, Signer, BigNumberish, string][]) {
    for (let i = 0; i < requests.length; i++) {
      await mintAndApprove(...requests[i]);
    }
  };

  await multiMintAndApprove([
    [TOKEN_USDC, user1, parseUnits("9000000", TOKENS_USDC_DECIMALS), CONTRACT_CURVE_EURS_ADDR],
    [TOKEN_EURS, user1, parseUnits("9000000", TOKENS_EURS_DECIMALS), CONTRACT_CURVE_EURS_ADDR]
  ]);

  const amt = parseUnits("10");
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

  // Check pool liquidity
  const [lpAmount, [baseBal, quoteBal]] = await curveEURS
    .liquidity();
  console.log('-----------------------------------------------------------------------');
  console.log('Liquidity Balance Before');
  console.log('-----------------------------------------------------------------------');

  console.log('Total: ', formatUnits(lpAmount));
  console.log('EURS: ', formatUnits(baseBal));
  console.log('USDC: ', formatUnits(quoteBal));

  const [baseViewUser1, quoteViewUser1] = await curveEURS.connect(user1).viewWithdraw(amt);

  console.log('-----------------------------------------------------------------------');
  console.log('Liquidity To Withdraw');
  console.log('-----------------------------------------------------------------------');
  console.log('EURS AMT: ', formatUnits(baseViewUser1, TOKENS_EURS_DECIMALS));
  console.log('USDC AMT: ', formatUnits(quoteViewUser1, TOKENS_USDC_DECIMALS));

  try {
    // Supply liquidity to the pools
    const withdrawCurveEURS = await curveEURS
      .withdraw(amt, await getFutureTime(), { gasLimit: 12000000 })
      .then(x => x.wait());

    console.log('withdrawCurveEURS', withdrawCurveEURS);

    // Check pool liquidity
    const [lpAmount, [baseBal, quoteBal]] = await curveEURS
      .liquidity();
    console.log('-----------------------------------------------------------------------');
    console.log('Liquidity Balance After');
    console.log('-----------------------------------------------------------------------');

    console.log('Total: ', formatUnits(lpAmount));
    console.log('EURS: ', formatUnits(baseBal));
    console.log('USDC: ', formatUnits(quoteBal));

    const eursBalAfter = await erc20.attach(eurs.address).balanceOf(user1.address);
    const usdcBalAfter = await erc20.attach(usdc.address).balanceOf(user1.address);

    console.log('\r');
    console.log(`EURS Balance After: `, formatUnits(eursBalAfter, TOKENS_EURS_DECIMALS));
    console.log(`USDC Balance After: `, formatUnits(usdcBalAfter, TOKENS_USDC_DECIMALS));

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