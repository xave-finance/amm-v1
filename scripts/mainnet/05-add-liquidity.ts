require("dotenv").config();
import { ethers } from "hardhat";

import { mintEURS, mintUSDC, getFutureTime } from "../../test/Utils";

import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { BigNumberish, Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";

const CONTRACT_CURVE_EURS_ADDR = process.env.CONTRACT_CURVE_EURS_ADDR;
const TOKEN_USDC = process.env.TOKENS_USDC_MAINNET_ADDR;
const TOKEN_EURS = process.env.TOKENS_EURS_MAINNET_ADDR;
const TOKENS_USDC_DECIMALS = process.env.TOKENS_USDC_DECIMALS;
const TOKENS_EURS_DECIMALS = process.env.TOKENS_EURS_DECIMALS;

async function main() {
  const [deployer, user1] = await ethers.getSigners();

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await deployer.getAddress()}`);
  console.log(`Deployer balance: ${await deployer.getBalance()}`);
  console.log(`User1 account: ${await user1.getAddress()}`);
  console.log(`User1 balance: ${await user1.getBalance()}`);

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

  // Supply liquidity to the pools
  const depositCurveEURS = await curveEURS
    .connect(deployer)
    .deposit(parseUnits("5000000"), await getFutureTime())
    .then(x => x.wait());

  console.log('Deposit: ', depositCurveEURS)

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
