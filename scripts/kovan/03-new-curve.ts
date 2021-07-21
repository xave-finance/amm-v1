require("dotenv").config();
import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { BigNumberish } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { NAME, SYMBOL, ALPHA, BETA, MAX, EPSILON, LAMBDA } from "../constants";

const CONTRACT_CURVE_FACTORY_ADDR = process.env.CONTRACT_CURVE_FACTORY_ADDR;
const CONTRACT_EURSTOUSDASSIMILATOR_ADDR = process.env.CONTRACT_EURSTOUSDASSIMILATOR_ADDR;
const CONTRACT_USDCTOUSDASSIMILATOR_ADDR = process.env.CONTRACT_USDCTOUSDASSIMILATOR_ADDR;

async function main() {
  const [_deployer, _user1] = await ethers.getSigners();

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

  const createCurve = async function ({
    name,
    symbol,
    base,
    quote,
    baseWeight,
    quoteWeight,
    baseAssimilator,
    quoteAssimilator,
  }: {
    name: string;
    symbol: string;
    base: string;
    quote: string;
    baseWeight: BigNumberish;
    quoteWeight: BigNumberish;
    baseAssimilator: string;
    quoteAssimilator: string;
  }): Promise<{ curve: Curve; curveLpToken: ERC20 }> {
    const tx = await curveFactory.newCurve(
      name,
      symbol,
      base,
      quote,
      baseWeight,
      quoteWeight,
      baseAssimilator,
      quoteAssimilator,
      {
        gasLimit: 12000000,
      },
    );
    await tx.wait();

    console.log("CurveFactory#newCurve TX Hash: ", tx.hash);

    // Get curve address
    const curveAddress = await curveFactory.curves(
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "address"], [base, quote])),
    );
    console.log("Curve Address: ", curveAddress);
    const curveLpToken = (await ethers.getContractAt("ERC20", curveAddress)) as ERC20;
    const curve = (await ethers.getContractAt("Curve", curveAddress)) as Curve;

    const turnOffWhitelisting = await curve.turnOffWhitelisting();
    console.log("Curve#turnOffWhitelisting TX Hash: ", turnOffWhitelisting.hash);

    return {
      curve,
      curveLpToken,
    };
  };

  const createCurveAndSetParams = async function ({
    name,
    symbol,
    base,
    quote,
    baseWeight,
    quoteWeight,
    baseAssimilator,
    quoteAssimilator,
  }: // params, -- we can actually set dimenstions here already or we can use script 3
  {
    name: string;
    symbol: string;
    base: string;
    quote: string;
    baseWeight: BigNumberish;
    quoteWeight: BigNumberish;
    baseAssimilator: string;
    quoteAssimilator: string;
    params: [BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish];
  }) {
    const { curve, curveLpToken } = await createCurve({
      name,
      symbol,
      base,
      quote,
      baseWeight,
      quoteWeight,
      baseAssimilator,
      quoteAssimilator,
    });
    // Set parameters/dimensions here --
    // const tx = await curve.setParams(...params, { gasLimit: 12000000 });
    // console.log('Curve#setParams TX Hash: ', tx.hash)
    // await tx.wait();
    return {
      curve,
      curveLpToken,
    };
  };

  const { curve: curveEURS } = await createCurveAndSetParams({
    name: NAME,
    symbol: SYMBOL,
    base: eurs.address,
    quote: usdc.address,
    baseWeight: parseUnits("0.5"),
    quoteWeight: parseUnits("0.5"),
    baseAssimilator: CONTRACT_EURSTOUSDASSIMILATOR_ADDR,
    quoteAssimilator: CONTRACT_USDCTOUSDASSIMILATOR_ADDR,
    params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
  });

  console.log(curveEURS);
  console.log("New curve created. Run next script to set dimension");

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
