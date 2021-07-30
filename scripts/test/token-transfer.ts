import { ethers } from "hardhat";
import { ERC20 } from "../../typechain/ERC20";
import { getAccounts } from "../common";

const TOKEN_EURS = process.env.TOKEN_EURS;

async function main() {
  const { user1 } = await getAccounts();
  const eurs = (await ethers.getContractAt("ERC20", TOKEN_EURS)) as ERC20;
  console.log('EURS Bal Before: ', ethers.utils.formatEther(await eurs.balanceOf(user1.address)));


  //   const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;

  //   const mintAndApprove = async function (
  //     tokenAddress: string,
  //     minter: Signer,
  //     amount: BigNumberish,
  //     recipient: string,
  //   ) {
  //     await erc20.attach(tokenAddress).connect(minter).approve(recipient, amount);
  //   };

  //   const multiMintAndApprove = async function (requests: [string, Signer, BigNumberish, string][]) {
  //     for (let i = 0; i < requests.length; i++) {
  //       await mintAndApprove(...requests[i]);
  //     }
  //   };

  //   // Mint tokens and approve
  //   await multiMintAndApprove([
  //     [TOKEN_USDC, user1, parseUnits("10000000000", TOKENS_USDC_DECIMALS), CONTRACT_CURVE_EURS_ADDR],
  //     [TOKEN_EURS, user1, parseUnits("10000000000", TOKENS_EURS_DECIMALS), CONTRACT_CURVE_EURS_ADDR]
  //   ]);

  //   const curveEURS = (await ethers.getContractAt("Curve", CONTRACT_CURVE_EURS_ADDR)) as Curve;
  //   const amt = parseUnits("1000000000", TOKENS_EURS_DECIMALS);
  //   const viewDepositCurveEURS = await curveEURS.viewDeposit(amt);



  //   console.log('-----------------------------------------------------------------------');
  //   console.log('Liquidity To Deposit');
  //   console.log('-----------------------------------------------------------------------');
  //   console.log('INPUT: ', amt);
  //   console.log('EURS AMT: ', formatUnits(viewDepositCurveEURS[1][0], TOKENS_EURS_DECIMALS));
  //   console.log('USDC AMT: ', formatUnits(viewDepositCurveEURS[1][1], TOKENS_USDC_DECIMALS));

  // // Supply liquidity to the pools
  // const depositCurveEURS = await curveEURS
  //   .deposit(amt, await getFutureTime(), {
  //     gasLimit: 12000000,
  //   })
  //   .then(x => x.wait());

  // console.log('depositCurveEURS', depositCurveEURS);

  // // Check pool liquidity
  // const viewLiquidity = await curveEURS
  //   .liquidity();
  // console.log('-----------------------------------------------------------------------');
  // console.log('Liquidity Balance');
  // console.log('-----------------------------------------------------------------------');

  // console.log('Total: ', formatUnits(viewLiquidity.total_));
  // console.log('EURS: ', formatUnits(viewLiquidity.individual_[0], TOKENS_EURS_DECIMALS));
  // console.log('USDC: ', formatUnits(viewLiquidity.individual_[1], TOKENS_USDC_DECIMALS));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });