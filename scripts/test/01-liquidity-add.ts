import { ethers } from "hardhat";
import { parseUnits, formatUnits } from "ethers/lib/utils";
import { BigNumberish, Signer } from "ethers";
import hre from "hardhat";
import fs from "fs";
import path from "path";

import { mintEURS, mintUSDC, getFutureTime } from "../../test/Utils";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { getAccounts } from "../common";
import { curveAddresses } from "../Utils";

const TOKEN_USDC = process.env.TOKEN_ADDR_USDC;
const TOKEN_XSGD = process.env.TOKEN_ADDR_XSGD;
const TOKEN_TCAD = process.env.TOKEN_ADDR_TCAD;
const TOKEN_EURS = process.env.TOKEN_ADDR_EURS;

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
    [TOKEN_USDC, user1, parseUnits("10000", TOKENS_USDC_DECIMALS), curves[TOKEN]],
    [TOKEN_ADDR, user1, parseUnits("10000", TOKEN_DECIMALS), curves[TOKEN]],
  ]);

  const amt = parseUnits("9000");
  const curve = (await ethers.getContractAt("Curve", curves[TOKEN])) as Curve;

  const tcad = (await ethers.getContractAt("ERC20", TOKEN_ADDR)) as ERC20;
  const tcadAllowanceBefore = await tcad.allowance(user1.address, curves[TOKEN]);

  console.log('TCAD Allowance Before: ', formatUnits(tcadAllowanceBefore, TOKEN_DECIMALS));

  try {
    // Supply liquidity to the pools
    const [lpt, [baseViewUser1, quoteViewUser1]] = await curve.viewDeposit(amt);
    console.log('formatUnits(lpt): ', formatUnits(lpt));

    const depositCurve = await curve
      .deposit(amt, await getFutureTime(), { gasLimit: 12000000 })
      .then(x => x.wait());
    console.log('depositCurve', depositCurve);

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