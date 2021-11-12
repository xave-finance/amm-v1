import { ethers } from "hardhat";
import { parseUnits, formatUnits } from "ethers/lib/utils";
import { BigNumberish, Signer } from "ethers";
import hre from "hardhat";
import { mintEURS, mintUSDC, getFutureTime, mintLolliToken } from "../../test/Utils";
import { ERC20 } from "../../typechain/ERC20";
import { getAccounts } from "../common";
import { curveAddresses } from "../Utils";
import { Curve } from "../../typechain";

const TOKEN_ADDR_USDC = process.env.TOKEN_ADDR_USDC;
const TOKEN_ADDR_EURS = process.env.TOKEN_ADDR_EURS;

async function main() {
  console.time("Deposit started");
  const users = await getAccounts();
  const user1 = users[0];

  const selectedCurve = "LPHP"; // change this to test different curves
  const curves = await curveAddresses();
  const curveAddress = curves[selectedCurve];
  console.log(`Depositing on curve ${selectedCurve}:`, curveAddress);

  const CurveContract = (await ethers.getContractAt("Curve", curveAddress)) as Curve;
  const baseTokenAddress = await CurveContract.derivatives(0);
  const quoteTokenAddress = await CurveContract.derivatives(1);
  console.log("Base token: ", baseTokenAddress);
  console.log("Quote token: ", quoteTokenAddress);

  const BaseTokenContract = (await ethers.getContractAt("ERC20", baseTokenAddress)) as ERC20;
  const QuoteTokenContract = (await ethers.getContractAt("ERC20", quoteTokenAddress)) as ERC20;
  const baseDecimals = await BaseTokenContract.decimals();
  const quoteDecimals = await QuoteTokenContract.decimals();

  const mintAndApprove = async function (
    tokenAddress: string,
    minter: Signer,
    amount: BigNumberish,
    recipient: string,
  ) {
    if (hre.network.name === "localhost") {
      const minterAddress = await minter.getAddress();

      if (tokenAddress.toLowerCase() === TOKEN_ADDR_USDC.toLowerCase()) {
        await mintUSDC(minterAddress, amount);
      } else if (tokenAddress.toLowerCase() === TOKEN_ADDR_EURS.toLowerCase()) {
        await mintEURS(minterAddress, amount);
      } else {
        await mintLolliToken(tokenAddress, minterAddress, amount);
      }
    }

    const TokenContract = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;
    await TokenContract.attach(tokenAddress).connect(minter).approve(recipient, amount);
  };

  const multiMintAndApprove = async function (requests: [string, Signer, BigNumberish, string][]) {
    for (let i = 0; i < requests.length; i++) {
      await mintAndApprove(...requests[i]);
    }
  };

  await multiMintAndApprove([
    [baseTokenAddress, user1, parseUnits("110000", baseDecimals), curveAddress],
    [quoteTokenAddress, user1, parseUnits("110000", quoteDecimals), curveAddress],
  ]);

  const depositAmount = parseUnits("1000"); // $500 for each token
  console.log("Deposit amount: ", formatUnits(depositAmount));

  try {
    // Estimate how much base & quote token will be deposited, and how much LPT will be received
    const [lpt, [baseNumeraire, quoteNumeraire]] = await CurveContract.viewDeposit(depositAmount);
    console.log("LPT to receive: ", formatUnits(lpt));
    console.log("Base deposit: ", formatUnits(baseNumeraire, baseDecimals));
    console.log("Quote deposit: ", formatUnits(quoteNumeraire, quoteDecimals));

    // Do actual deposit
    const tx = await CurveContract.deposit(depositAmount, await getFutureTime(), {
      gasLimit: 12000000,
      gasPrice: parseUnits("100", 9),
    });
    console.log("Deposit completed: tx#", tx.hash);
    await tx.wait();

    console.timeEnd("Deposit successful");
  } catch (error) {
    console.log(error);
    console.timeEnd("Deposit failed");
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
