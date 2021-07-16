const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.localhost') });

import { ethers } from "hardhat";
import { mintEURS, mintUSDC, getFutureTime } from "../../test/Utils";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { BigNumberish, Signer } from "ethers";
import { parseUnits, parseEther, formatEther, formatUnits } from "ethers/lib/utils";

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

  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;

  const mintAndApprove = async function (
    tokenAddress: string,
    minter: Signer,
    amount: BigNumberish,
    recipient: string,
  ) {
    const minterAddress = await minter.getAddress();

    if (tokenAddress.toLowerCase() === TOKEN_USDC.toLowerCase()) {
      await mintUSDC(minterAddress, amount);
    }

    if (tokenAddress.toLowerCase() === TOKEN_EURS.toLowerCase()) {
      await mintEURS(minterAddress, amount);
    }

    await erc20.attach(tokenAddress).connect(minter).approve(recipient, amount);
  };

  const multiMintAndApprove = async function (requests: [string, Signer, BigNumberish, string][]) {
    for (let i = 0; i < requests.length; i++) {
      await mintAndApprove(...requests[i]);
    }
  };

  // Mint tokens and approve
  await multiMintAndApprove([
    [TOKEN_USDC, deployer, parseUnits("10000000", TOKENS_USDC_DECIMALS), CONTRACT_CURVE_EURS_ADDR],
    [TOKEN_EURS, deployer, parseUnits("10000000", TOKENS_EURS_DECIMALS), CONTRACT_CURVE_EURS_ADDR]
  ]);

  const curveEURS = (await ethers.getContractAt("Curve", CONTRACT_CURVE_EURS_ADDR)) as Curve;

  const eurAmt = parseEther("1");
  console.log(eurAmt);
  console.log(formatEther(eurAmt));
  const viewDepositCurveEURS = await curveEURS.connect(deployer).viewDeposit(eurAmt);

  console.log('INPUT: ', formatEther(eurAmt));
  console.log('EURS AMT: ', formatUnits(viewDepositCurveEURS[1][0]));
  console.log('USDC AMT: ', formatUnits(viewDepositCurveEURS[1][1]));

  // Supply liquidity to the pools
  const depositCurveEURS = await curveEURS
    .connect(deployer)
    .deposit(parseUnits("5000000"), await getFutureTime())
    .then(x => x.wait());

  console.log('Deposit: ', depositCurveEURS)

  // Check pool liquidity
  const viewLiquidity = await curveEURS
    .connect(deployer)
    .liquidity()

  console.log(formatEther(viewLiquidity.total_))
  console.log(formatEther(viewLiquidity.individual_[0]))
  console.log(formatEther(viewLiquidity.individual_[1]))


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
