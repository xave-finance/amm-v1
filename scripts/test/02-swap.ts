import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { Router } from "../../typechain/Router";
import { ERC20 } from "../../typechain/ERC20";
import { parseUnits, formatUnits, formatEther } from "ethers/lib/utils";
import { getAccounts } from "../common";

import { getFutureTime } from "../../test/Utils";
import { curveAddresses } from "../Utils";

const TOKEN_USDC = process.env.TOKEN_ADDR_USDC;
const TOKEN_TCAD = process.env.TOKEN_ADDR_TCAD;

const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
const TOKENS_TCAD_DECIMALS = process.env.TOKENS_TCAD_DECIMALS;

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const curves = await curveAddresses();
  const TOKEN = 'TCAD';
  const TOKEN_ADDR = TOKEN_TCAD;
  const TOKEN_DECIMALS = TOKENS_TCAD_DECIMALS;
  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;
  const curve = (await ethers.getContractAt("Curve", curves[TOKEN])) as Curve;

  const amt = parseUnits("78", TOKEN_DECIMALS);

  await erc20.attach(TOKEN_ADDR).connect(user1)
    .approve(curves[TOKEN], amt);

  const viewRouterSwap = await curve
    .connect(user1)
    .viewOriginSwap(TOKEN_ADDR, TOKEN_USDC, amt);

  console.log('\r');
  console.log('Origin Swap Amount To (contract): ', formatUnits(viewRouterSwap, TOKENS_USDC_DECIMALS));
  console.log('\r');

  await curve
    .connect(user1)
    .originSwap(TOKEN_ADDR, TOKEN_USDC, amt, 0, await getFutureTime(), {
      gasLimit: 3000000,
    });

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