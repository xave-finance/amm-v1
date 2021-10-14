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
const TOKEN_TCAD = process.env.TOKEN_ADDR_TCAD;

const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
const TOKENS_XSGD_DECIMALS = process.env.TOKENS_XSGD_DECIMALS;
const TOKENS_TCAD_DECIMALS = process.env.TOKENS_TCAD_DECIMALS;

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const curves = await curveAddresses();
  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;
  // const curveXSGD = (await ethers.getContractAt("Curve", curves['XSGD'])) as Curve;
  const curveTCAD = (await ethers.getContractAt("Curve", curves['TCAD'])) as Curve;

  // await erc20.attach(TOKEN_XSGD).connect(user1)
  //   .approve(curves['XSGD'], parseUnits("10000", TOKENS_XSGD_DECIMALS));
  await erc20.attach(TOKEN_TCAD).connect(user1)
    .approve(curves['TCAD'], parseUnits("10000", TOKENS_TCAD_DECIMALS));

  const usdcBalBefore = await erc20.attach(TOKEN_USDC).balanceOf(user1.address);
  // const xsgdBalBefore = await erc20.attach(TOKEN_XSGD).balanceOf(user1.address);
  // const xsgd = (await ethers.getContractAt("ERC20", TOKEN_XSGD)) as ERC20;
  // const xsgdAllowanceBefore = await xsgd.allowance(user1.address, curves['XSGD']);
  const tcadBalBefore = await erc20.attach(TOKEN_TCAD).balanceOf(user1.address);
  const tcad = (await ethers.getContractAt("ERC20", TOKEN_TCAD)) as ERC20;
  const tcadAllowanceBefore = await tcad.allowance(user1.address, curves['TCAD']);

  console.log('\r');
  // console.log('XSGD Balance Before: ', formatUnits(xsgdBalBefore, TOKENS_XSGD_DECIMALS));
  // console.log('XSGD Allowance Before: ', formatUnits(xsgdAllowanceBefore, TOKENS_XSGD_DECIMALS));
  console.log('TCAD Balance Before: ', formatUnits(tcadBalBefore, TOKENS_TCAD_DECIMALS));
  console.log('TCAD Allowance Before: ', formatUnits(tcadAllowanceBefore, TOKENS_TCAD_DECIMALS));
  console.log('USDC Balance Before: ', formatUnits(usdcBalBefore, TOKENS_USDC_DECIMALS));

  // const lpAmount = await curveXSGD.balanceOf(user1.address);
  const lpAmount = await curveTCAD.balanceOf(user1.address);

  console.log('lpAmount: ', formatUnits(lpAmount));

  // const [baseViewUser1, quoteViewUser1] = await curveXSGD
  //   .connect(user1)
  //   .viewWithdraw(lpAmount);
  const [baseViewUser1, quoteViewUser1] = await curveTCAD
    .connect(user1)
    .viewWithdraw(lpAmount);

  console.log('\r');
  // console.log('XSGD to withdraw: ', formatUnits(baseViewUser1, TOKENS_XSGD_DECIMALS));
  console.log('TCAD to withdraw: ', formatUnits(baseViewUser1, TOKENS_USDC_DECIMALS));
  console.log('USDC to withdraw: ', formatUnits(quoteViewUser1, TOKENS_USDC_DECIMALS));
  console.log('\r');

  // const withdrawcurveXSGD = await curveXSGD
  //   .connect(user1)
  //   .withdraw(lpAmount, await getFutureTime())
  //   .then(x => x.wait());
  const withdrawcurveTCAD = await curveTCAD
    .connect(user1)
    .withdraw(lpAmount, await getFutureTime())
    .then(x => x.wait());

  // console.log('withdrawcurveXSGD: ', withdrawcurveXSGD);
  console.log('withdrawcurveXSGD: ', withdrawcurveTCAD);

  // const xsgdBalAfter = await erc20.attach(TOKEN_XSGD).balanceOf(user1.address);
  const tcadBalAfter = await erc20.attach(TOKEN_TCAD).balanceOf(user1.address);
  const usdcBalAfter = await erc20.attach(TOKEN_USDC).balanceOf(user1.address);

  // console.log('XSGD Balance After: ', formatUnits(xsgdBalAfter, TOKENS_XSGD_DECIMALS));
  console.log('XSGD Balance After: ', formatUnits(tcadBalAfter, TOKENS_TCAD_DECIMALS));
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