import { ethers } from "hardhat";
import { parseUnits, formatUnits } from "ethers/lib/utils";
import { BigNumberish, Signer } from "ethers";
import hre from "hardhat";
import fs from "fs";
import path from "path";

import { mintEURS, mintUSDC, getFutureTime } from "../../test/Utils";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { getAccounts, getFastGasPrice } from "../common";
import { curveAddresses } from "../Utils";

const TOKEN_USDC = process.env.TOKEN_ADDR_USDC;
const TOKEN_XSGD = process.env.TOKEN_ADDR_XSGD;
const TOKEN_TCAD = process.env.TOKEN_ADDR_TCAD;
const TOKEN_TAUD = process.env.TOKEN_ADDR_TAUD;
const TOKEN_EURS = process.env.TOKEN_ADDR_EURS;

const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
const TOKENS_XSGD_DECIMALS = process.env.TOKENS_XSGD_DECIMALS;
const TOKENS_TCAD_DECIMALS = process.env.TOKENS_TCAD_DECIMALS;
const TOKENS_TAUD_DECIMALS = process.env.TOKENS_TAUD_DECIMALS;

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const curves = await curveAddresses();
  const TOKEN = 'TAUD';
  const curve = (await ethers.getContractAt("Curve", curves[TOKEN])) as Curve;
  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;

  // Approve tokens
  const mintAndApprove = async function (
    tokenAddress: string,
    minter: Signer,
    amount: BigNumberish,
    recipient: string,
  ) {
    await erc20.attach(tokenAddress).connect(minter).approve(recipient, amount);
  };

  const multiMintAndApprove = async function (requests: [string, Signer, BigNumberish, string][]) {
    for (let i = 0; i < requests.length; i++) {
      await mintAndApprove(...requests[i]);
    }
  };

  await multiMintAndApprove([
    [TOKEN_USDC, user1, parseUnits("10000", TOKENS_USDC_DECIMALS), curves[TOKEN]],
    [TOKEN_TAUD, user1, parseUnits("10000", TOKENS_TAUD_DECIMALS), curves[TOKEN]],
  ]);

  const amt = parseUnits("9000");
  const gasPrice = await getFastGasPrice();

  try {
    // Supply liquidity to the pools
    const depositCurve = await curve
      .deposit(amt, await getFutureTime(), { gasLimit: 12000000, gasPrice })
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