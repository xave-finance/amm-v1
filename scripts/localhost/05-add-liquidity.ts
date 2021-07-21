const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.localhost") });

import { ethers } from "hardhat";
import { mintEURS, mintUSDC, getFutureTime } from "../../test/Utils";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { BigNumberish, Signer } from "ethers";
import { parseUnits, parseEther, formatEther, formatUnits } from "ethers/lib/utils";
import { formatCurrency, TOKEN_DECIMAL, TOKEN_NAME } from "../utils";

const CONTRACT_CURVE_EURS_ADDR = process.env.CONTRACT_CURVE_EURS_ADDR;
const TOKEN_USDC = process.env.TOKENS_USDC_ADDR;
const TOKEN_EURS = process.env.TOKENS_EURS_ADDR;
const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
const TOKENS_EURS_DECIMALS = process.env.TOKENS_EURS_DECIMALS;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await deployer.getAddress()}`);
  console.log(`Deployer balance: ${await deployer.getBalance()}`);

  const curveEURS = (await ethers.getContractAt("Curve", CONTRACT_CURVE_EURS_ADDR)) as Curve;

  const eurAmt = parseEther("20");
  console.log(eurAmt);
  const viewDepositCurveEURS = await curveEURS.connect(deployer).viewDeposit(eurAmt);

  console.log("-----------------------------------------------------------------------");
  console.log("Liquidity To Deposit");
  console.log("-----------------------------------------------------------------------");
  console.log("INPUT: ", formatEther(eurAmt));
  console.log("EURS AMT: ", formatCurrency(TOKEN_NAME.EURS, TOKEN_DECIMAL.EURS, viewDepositCurveEURS[1][0]));
  console.log("USDC AMT: ", formatCurrency(TOKEN_NAME.USDC, TOKEN_DECIMAL.USDC, viewDepositCurveEURS[1][1]));

  // Supply liquidity to the pools
  await curveEURS
    .connect(deployer)
    .deposit(eurAmt, await getFutureTime())
    .then(x => x.wait());

  // Check pool liquidity
  const viewLiquidity = await curveEURS.connect(deployer).liquidity();

  console.log("-----------------------------------------------------------------------");
  console.log("Liquidity Balance");
  console.log("-----------------------------------------------------------------------");
  console.log("Total: ", formatUnits(viewLiquidity.total_));
  console.log("EURS: ", formatUnits(viewLiquidity.individual_[0], TOKENS_EURS_DECIMALS));
  console.log("USDC: ", formatUnits(viewLiquidity.individual_[1], TOKENS_USDC_DECIMALS));

  console.log(`Deployer balance: ${await deployer.getBalance()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
