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
const TOKEN_EURS = process.env.TOKEN_ADDR_EURS;
const TOKEN_AUD = process.env.TOKEN_ADDR_AUD
const TOKEN_CHF = process.env.TOKEN_ADDR_CHF
const TOKEN_GBP = process.env.TOKEN_ADDR_GBP

const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
const TOKENS_EURS_DECIMALS = process.env.TOKENS_EURS_DECIMALS;
const TOKENS_AUD_DECIMALS = process.env.TOKENS_AUD_DECIMALS;
const TOKENS_CHF_DECIMALS = process.env.TOKENS_CHF_DECIMALS;
const TOKENS_GBP_DECIMALS = process.env.TOKENS_GBP_DECIMALS;

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const oq_curves = await curveAddresses();
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
    [TOKEN_USDC, user1, parseUnits("9000000", TOKENS_USDC_DECIMALS), oq_curves['EURS']],
    [TOKEN_EURS, user1, parseUnits("9000000", TOKENS_EURS_DECIMALS), oq_curves['EURS']],

    // [TOKEN_USDC, user1, parseUnits("9000000", TOKENS_USDC_DECIMALS), oq_curves['AUD']],
    // [TOKEN_AUD, user1, parseUnits("9000000", TOKENS_AUD_DECIMALS), oq_curves['AUD']],

    // [TOKEN_USDC, user1, parseUnits("9000000", TOKENS_USDC_DECIMALS), oq_curves['CHF']],
    // [TOKEN_CHF, user1, parseUnits("9000000", TOKENS_CHF_DECIMALS), oq_curves['CHF']],

    // [TOKEN_USDC, user1, parseUnits("9000000", TOKENS_USDC_DECIMALS), oq_curves['GBP']],
    // [TOKEN_GBP, user1, parseUnits("9000000", TOKENS_GBP_DECIMALS), oq_curves['GBP']]
  ]);

  const amt = parseUnits("700000"); // EURS
  // const amt = parseUnits("700000"); // AUD
  // const amt = parseUnits("70000"); // CHF
  // const amt = parseUnits("700000"); // GBP

  const curveEURS = (await ethers.getContractAt("Curve", oq_curves['EURS'])) as Curve;
  // const curveAUD = (await ethers.getContractAt("Curve", oq_curves['AUD'])) as Curve;
  // const curveCHF = (await ethers.getContractAt("Curve", oq_curves['CHF'])) as Curve;
  // const curveGBP = (await ethers.getContractAt("Curve", oq_curves['GBP'])) as Curve;

  try {
    // Supply liquidity to the pools
    const depositCurveEURS = await curveEURS
      .deposit(amt, await getFutureTime(), { gasLimit: 12000000 })
      .then(x => x.wait());
    console.log('depositCurveEURS', depositCurveEURS);

    // const depositCurveAUD = await curveAUD
    //   .deposit(amt, await getFutureTime(), { gasLimit: 12000000 })
    //   .then(x => x.wait());
    // console.log('depositCurveAUD', depositCurveAUD);

    // const depositCurveCHF = await curveCHF
    //   .deposit(amt, await getFutureTime(), { gasLimit: 12000000 })
    //   .then(x => x.wait());
    // console.log('depositCurveAUD', depositCurveCHF);

    // const depositCurveGBP = await curveGBP
    //   .deposit(amt, await getFutureTime(), { gasLimit: 12000000 })
    //   .then(x => x.wait());
    // console.log('depositCurveGBP', depositCurveGBP);

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