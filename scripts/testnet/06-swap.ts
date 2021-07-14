require("dotenv").config();
import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { formatCurrency, parseCurrency, TOKEN_DECIMAL, TOKEN_NAME, getFutureTime } from "../utils";
import { createCurveAndSetParams } from "../curveFunctions";

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

  const { curve: curveEURS } = await createCurveAndSetParams({
    curveFactory: curveFactory,
    base: eurs.address,
    quote: usdc.address,
  });

  const eurAmount = "10";
  console.log(`Exchanging ${eurAmount} EURS to USDC.`);
  const beforeBalance = await usdc.balanceOf(await _deployer.getAddress());
  console.log("Before USDC bal", formatCurrency(TOKEN_NAME.USDC, TOKEN_DECIMAL.USDC, beforeBalance));

  const swapTxn = await curveEURS
    .connect(_deployer)
    .originSwap(
      eurs.address,
      usdc.address,
      parseCurrency(TOKEN_NAME.EURS, TOKEN_DECIMAL.EURS, "10"),
      0,
      await getFutureTime(provider),
      {
        gasLimit: 3000000,
      },
    );

  console.log(await swapTxn.wait());
  const afterBalance = await usdc.balanceOf(await _deployer.getAddress());
  console.log(
    "Difference after swap:",
    formatCurrency(TOKEN_NAME.USDC, TOKEN_DECIMAL.USDC, afterBalance.sub(beforeBalance)),
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
