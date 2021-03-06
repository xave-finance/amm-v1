import { ethers } from "hardhat";
import { parseUnits, formatUnits } from "ethers/lib/utils";
import { BigNumberish, Signer } from "ethers";
import hre from "hardhat";
import { mintEURS, mintUSDC, getFutureTime } from "../../test/Utils";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { getAccounts, getFastGasPrice } from "../common";

const USDC_ADDRESS = process.env.TOKEN_ADDR_USDC;
const EURS_ADDRESS = process.env.TOKEN_ADDR_EURS;

const mintAndApprove = async function (tokenAddress: string, minter: Signer, amount: BigNumberish, recipient: string) {
  const minterAddress = await minter.getAddress();

  if (hre.network.name === "localhost") {
    if (tokenAddress.toLowerCase() === USDC_ADDRESS.toLowerCase()) {
      await mintUSDC(minterAddress, amount);
    }

    if (tokenAddress.toLowerCase() === EURS_ADDRESS.toLowerCase()) {
      await mintEURS(minterAddress, amount);
    }
  }

  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;
  await erc20.attach(tokenAddress).connect(minter).approve(recipient, amount);
};

const multiMintAndApprove = async function (requests: [string, Signer, BigNumberish, string][]) {
  for (let i = 0; i < requests.length; i++) {
    await mintAndApprove(...requests[i]);
  }
};

async function main() {
  console.time("Deployment Time");
  const users = await getAccounts();
  const user1 = users[0];

  /**
   * Change the 5 const below to test other curves (token pairs)
   */
  const curveAddress = "0xF1f9eE0A8bE74e8EEcf547cc53EaD6093fc7493a";
  const baseTokenAddress = "0x59847B1314E1A1cad9E0a207F6E53c04F4FAbFBD";
  const quoteTokenAddress = "0x85B210deD75878CC7824D0cf2AEfd0b42Ee0e265";
  const baseTokenDecimals = 18;
  const quoteTokenDecimals = 6;

  await multiMintAndApprove([
    [baseTokenAddress, user1, parseUnits("1000000", baseTokenDecimals), curveAddress],
    [quoteTokenAddress, user1, parseUnits("1000000", quoteTokenDecimals), curveAddress],
  ]);

  const amt = parseUnits("100");
  console.log("Deposit amount: ", formatUnits(amt));
  const curve = (await ethers.getContractAt("Curve", curveAddress)) as Curve;

  try {
    // Supply liquidity to the pools
    const [lpt, [baseDeposit, quoteDeposit]] = await curve.viewDeposit(amt);
    console.log("To deposit base: ", formatUnits(baseDeposit, baseTokenDecimals));
    console.log("To deposit quote: ", formatUnits(quoteDeposit, quoteTokenDecimals));
    console.log("To receive HLP: ", formatUnits(lpt));

    const gasPrice = await getFastGasPrice();
    const tx = await curve.deposit(amt, await getFutureTime(), {
      gasPrice,
    });
    console.log("Tx hash: ", tx.hash);
    await tx.wait();

    console.timeEnd("Deposit completed");
  } catch (error) {
    console.log(error);
    console.timeEnd("Deposit failed");
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
