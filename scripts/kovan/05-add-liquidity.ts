require("dotenv").config();
import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { parseEther } from "ethers/lib/utils";
import { createCurveAndSetParams } from "../curveFunctions";
import { formatCurrency, getFutureTime, TOKEN_DECIMAL, TOKEN_NAME } from "../utils";

const CONTRACT_CURVE_FACTORY_ADDR = process.env.CONTRACT_CURVE_FACTORY_ADDR;

async function main() {
  const [_deployer, _user1] = await ethers.getSigners();
  const provider = _deployer.provider; // get provider instance from deployer or account[0]

  // replace env or address
  const TOKEN_USDC = process.env.TOKENS_USDC_KOVAN_ADDR;
  const TOKEN_EURS = process.env.TOKENS_EURS_KOVAN_ADDR;

  console.log(`Deployer account: ${await _deployer.getAddress()}`);
  console.log(`Deployer balance: ${await _deployer.getBalance()}`);
  console.log(`User1 account: ${await _user1.getAddress()}`);
  console.log(`User1 balance: ${await _user1.getBalance()}`);

  const curveFactory = (await ethers.getContractAt("CurveFactory", CONTRACT_CURVE_FACTORY_ADDR)) as Curve;
  const usdc = (await ethers.getContractAt("ERC20", TOKEN_USDC)) as ERC20;
  const eurs = (await ethers.getContractAt("ERC20", TOKEN_EURS)) as ERC20;
  const erc20 = (await ethers.getContractAt("ERC20", ethers.constants.AddressZero)) as ERC20;

  const { curve: curveEURS } = await createCurveAndSetParams({
    curveFactory: curveFactory,
    base: eurs.address,
    quote: usdc.address,
  });

  const LP_TOKENS_AMOUNT = "500";
  const LP_TOKENS_TO_MINT = parseEther(LP_TOKENS_AMOUNT); // 18 precision
  console.log(`Checking how much liquidity to provide minting ${LP_TOKENS_AMOUNT}`);
  const depositToCurveEURS = await curveEURS.connect(_deployer).viewDeposit(LP_TOKENS_TO_MINT);
  console.log(
    `You will provide ${formatCurrency(
      TOKEN_NAME.EURS,
      TOKEN_DECIMAL.EURS,
      depositToCurveEURS[1][0],
    )} in EURS and ${formatCurrency(
      TOKEN_NAME.USDC,
      TOKEN_DECIMAL.USDC,
      depositToCurveEURS[1][1],
    )} in USDC to receive ${LP_TOKENS_AMOUNT} LP Tokens. Depositing..`,
  );

  const depositTxn = await curveEURS.connect(_deployer).deposit(LP_TOKENS_TO_MINT, await getFutureTime(provider));
  console.log(await depositTxn.wait());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
