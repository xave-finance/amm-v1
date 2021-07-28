import hre from "hardhat";
import chalk from "chalk";
import { ethers } from "hardhat";
import { mintEURS, mintUSDC, getFutureTime } from "../../test/Utils";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { BigNumberish, Signer } from "ethers";
import { parseUnits, parseEther, formatEther, formatUnits } from "ethers/lib/utils";
import { getAccounts, getFastGasPrice } from "../common";

const CONTRACT_CURVE_EURS_ADDR = "0x6e1a1B3bf4c01EB602F4872711bcCE4cc4b63AE9";
const TOKEN_USDC = process.env.TOKEN_USDC;
const TOKEN_EURS = process.env.TOKEN_EURS;
const TOKENS_USDC_DECIMALS = 6;
const TOKENS_EURS_DECIMALS = 2;

async function main() {
  const { user2 } = await getAccounts();

  const curveEURS = (await ethers.getContractAt("Curve", CONTRACT_CURVE_EURS_ADDR)) as Curve;

  // Supply liquidity to the pools
  const depositCurveEURS = await curveEURS
    .connect(user2)
    .turnOffWhitelisting()
    .then(x => x.wait());

  console.log(`User2 balance: ${await user2.getBalance()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });