import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
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
  const TOKEN = 'TCAD';
  const TOKEN_ADDR = TOKEN_TCAD;
  const TOKEN_DECIMALS = TOKENS_TCAD_DECIMALS;
  const curves = await curveAddresses();
  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;
  const curve = (await ethers.getContractAt("Curve", curves[TOKEN])) as Curve;

  await erc20.attach(TOKEN_ADDR).connect(user1)
    .approve(curves[TOKEN], parseUnits("10000", TOKEN_DECIMALS));

  const lpAmount = await curve.balanceOf(user1.address);
  const [baseViewUser1, quoteViewUser1] = await curve
    .connect(user1)
    .viewWithdraw(lpAmount);

  console.log('\r');
  console.log('Base to emerg-withdraw: ', formatUnits(baseViewUser1, TOKEN_DECIMALS));
  console.log('USDC to emerg-withdraw: ', formatUnits(quoteViewUser1, TOKENS_USDC_DECIMALS));
  console.log('\r');

  const isEmergencyBefore = await curve
    .connect(user1)
    .emergency();
  console.log('isEmergency Before: ', isEmergencyBefore);

  await curve
    .connect(user1)
    .setEmergency(true)
    .then(x => x.wait());

  const isEmergencyAfter = await curve
    .connect(user1)
    .emergency();
  console.log('isEmergency After: ', isEmergencyAfter);

  const withdrawcurve = await curve
    .connect(user1)
    .emergencyWithdraw(lpAmount, await getFutureTime(), { gasLimit: 12000000 })
    .then(x => x.wait());

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