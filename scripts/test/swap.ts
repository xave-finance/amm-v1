import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { Router } from "../../typechain/Router";
import { ERC20 } from "../../typechain/ERC20";
import { parseUnits, formatUnits, formatEther } from "ethers/lib/utils";
import { getAccounts } from "../common";

import { getFutureTime } from "../../test/Utils";
import { curveAddresses } from "../Utils";

const TOKEN_USDC = process.env.TOKEN_ADDR_USDC;
const TOKEN_XSGD = process.env.TOKEN_ADDR_XSGD;

const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
const TOKENS_XSGD_DECIMALS = process.env.TOKENS_XSGD_DECIMALS;

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const curves = await curveAddresses();
  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;
  const curveXSGD = (await ethers.getContractAt("Curve", curves['XSGD'])) as Curve;

  await erc20.attach(TOKEN_XSGD).connect(user1)
    .approve(curves['XSGD'], parseUnits("10000", TOKENS_XSGD_DECIMALS));

  const amt = parseUnits("78", TOKENS_XSGD_DECIMALS);
  const xsgdBalBefore = await erc20.attach(TOKEN_XSGD).balanceOf(user1.address);
  const usdcBalBefore = await erc20.attach(TOKEN_USDC).balanceOf(user1.address);
  const xsgd = (await ethers.getContractAt("ERC20", TOKEN_XSGD)) as ERC20;
  const xsgdAllowanceBefore = await xsgd.allowance(user1.address, curves['XSGD']);

  console.log('\r');
  console.log('XSGD Balance Before: ', formatUnits(xsgdBalBefore, TOKENS_XSGD_DECIMALS));
  console.log('USDC Balance Before: ', formatUnits(usdcBalBefore, TOKENS_USDC_DECIMALS));
  console.log('XSGD Allowance Before: ', formatUnits(xsgdAllowanceBefore, TOKENS_XSGD_DECIMALS));

  const viewRouterSwapXSGD = await curveXSGD
    .connect(user1)
    .viewOriginSwap(TOKEN_XSGD, TOKEN_USDC, amt);

  console.log('\r');
  console.log('Origin Swap Amount To (contract): ', formatUnits(viewRouterSwapXSGD, TOKENS_USDC_DECIMALS));
  console.log('\r');

  await curveXSGD
    .connect(user1)
    .originSwap(TOKEN_XSGD, TOKEN_USDC, amt, 0, await getFutureTime(), {
      gasLimit: 3000000,
    });

  const xsgdBalAfter = await erc20.attach(TOKEN_XSGD).balanceOf(user1.address);
  const usdcBalAfter = await erc20.attach(TOKEN_USDC).balanceOf(user1.address);

  console.log('XSGD Balance After: ', formatUnits(xsgdBalAfter, TOKENS_XSGD_DECIMALS));
  console.log('USDC Balance After: ', formatUnits(usdcBalAfter, TOKENS_USDC_DECIMALS));
  console.timeEnd('Deployment Time');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });