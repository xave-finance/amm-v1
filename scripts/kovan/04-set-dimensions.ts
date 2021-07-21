require("dotenv").config();
import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { BigNumberish } from "ethers";
import { createCurve } from "../curveFunctions";
import { ALPHA, BETA, MAX, EPSILON, LAMBDA } from "../constants";

const CONTRACT_CURVE_FACTORY_ADDR = process.env.CONTRACT_CURVE_FACTORY_ADDR;

async function main() {
  const [_deployer, _user1] = await ethers.getSigners();
  const provider = _deployer.provider; // get provider instance from deployer or account[0]

  // replace env or address
  const TOKEN_USDC = process.env.TOKENS_USDC_KOVAN_ADDR;
  const TOKEN_EURS = process.env.TOKENS_EURS_KOVAN_ADDR;

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await _deployer.getAddress()}`);
  console.log(`Deployer balance: ${await _deployer.getBalance()}`);
  console.log(`User1 account: ${await _user1.getAddress()}`);
  console.log(`User1 balance: ${await _user1.getBalance()}`);

  const curveFactory = (await ethers.getContractAt("CurveFactory", CONTRACT_CURVE_FACTORY_ADDR)) as Curve;
  const usdc = (await ethers.getContractAt("ERC20", TOKEN_USDC)) as ERC20;
  const eurs = (await ethers.getContractAt("ERC20", TOKEN_EURS)) as ERC20;

  const createCurveAndSetParams = async function ({
    base,
    quote,
    params,
  }: {
    base: string;
    quote: string;

    params: [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish];
  }) {
    const { curve, curveLpToken } = await createCurve({
      curveFactory,
      base,
      quote,
    });

    const tx = await curve.setParams(...params, { gasLimit: 12000000 });
    console.log("Curve#setParams TX Hash: ", tx.hash);
    await tx.wait();

    return {
      curve,
      curveLpToken,
    };
  };

  const { curve: curveEURS } = await createCurveAndSetParams({
    base: eurs.address,
    quote: usdc.address,
    params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
  });

  console.log(curveEURS);
  console.log("Dimensions set. Run add liquidity script next.");
  console.log(`Deployer balance: ${await _deployer.getBalance()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
