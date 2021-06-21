import { ethers } from "hardhat";

import { TOKENS } from "../../test/Constants";
import { mintCADC, mintEURS, mintUSDC, mintXSGD, getFutureTime } from "../../test/Utils";

import { CurveFactory } from "../../typechain/CurveFactory";
import { Curve } from "../../typechain/Curve";
import { ERC20 } from "../../typechain/ERC20";
import { Router } from "../../typechain/Router";
import { BigNumberish, Signer } from "ethers";
import { parseUnits } from "ethers/lib/utils";

const hre = require("hardhat")

const NAME = "DFX V1";
const SYMBOL = "DFX-V1";

// Weights are always 50/50

// Pool must respect a 10/90 ratio
// i.e. value of one pair cannot exceed 90% of the pools value
const ALPHA = parseUnits("0.8");

// Slippage (fees) will that will be introduced when one of the tokens's ratio:
// - exceeds 75% of the pool value
// - goes under 25% of the pool value
const BETA = parseUnits("0.5");

const MAX = parseUnits("0.15");
const EPSILON = parseUnits("0.0005"); // 5 basis point
const LAMBDA = parseUnits("0.3");

export const getDeployer = async (): Promise<{
	deployer: Signer;
	user1: Signer;
	user2: Signer;
}> => {
	const [deployer, user1, user2] = await ethers.getSigners();
	return {
		deployer,
		user1,
		user2,
	};
};

async function main() {
	const { deployer, user1 } = await getDeployer();

	console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
	console.log(`Deployer account: ${await deployer.getAddress()}`);

	const curveFactory = (await ethers.getContractAt("CurveFactory", "0xBD39814D010E9D4F1A99Ab648C7a57a55c896829")) as Curve;
	const usdc = (await ethers.getContractAt("ERC20", TOKENS.USDC.address)) as ERC20;
	const cadc = (await ethers.getContractAt("ERC20", TOKENS.CADC.address)) as ERC20;

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
		// const tx = await curveFactory.newCurve(
		// 	name,
		// 	symbol,
		// 	base,
		// 	quote,
		// 	baseWeight,
		// 	quoteWeight,
		// 	baseAssimilator,
		// 	quoteAssimilator,
		// 	{
		// 		gasLimit: 12000000,
		// 	},
		// );
		// await tx.wait();

		// console.log('CurveFactory#newCurve TX Hash: ', tx.hash)

		// Get curve address
		const curveAddress = await curveFactory.curves(
			ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "address"], [base, quote])),
		);
		console.log('CurveFactory#curves Address: ', curveAddress)
		const curveLpToken = (await ethers.getContractAt("ERC20", curveAddress)) as ERC20;
		const curve = (await ethers.getContractAt("Curve", curveAddress)) as Curve;

		const turnOffWhitelisting = await curve.turnOffWhitelisting();
		console.log('Curve#turnOffWhitelisting TX Hash: ', turnOffWhitelisting.hash)

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
		params,
	}: {
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

		console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
		console.log('Dimension Parameters', params)
		console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')

		const tx = await curve.setParams(...params, { gasLimit: 12000000 });
		console.log('Curve#setParams TX Hash: ', tx.hash)
		await tx.wait();

		return {
			curve,
			curveLpToken,
		};
	};

	const { curve: curveCADC } = await createCurveAndSetParams({
		name: NAME,
		symbol: SYMBOL,
		base: cadc.address,
		quote: usdc.address,
		baseWeight: parseUnits("0.5"),
		quoteWeight: parseUnits("0.5"),
		baseAssimilator: "0x94C59F312aBbC73b4D0AacD173f40D03460A5A6e",
		quoteAssimilator: "0xAC7Abf5caC3cA3fe0BD931E39EBf062FeDa7AACB",
		params: [ALPHA, BETA, MAX, EPSILON, LAMBDA],
	});

	// -------- Commented out by default
	// console.log("ALPHA", formatUnits(ALPHA));
	// console.log("BETA", formatUnits(BETA));
	// console.log("MAX", formatUnits(MAX));
	// console.log("EPSILON", formatUnits(EPSILON));
	// console.log("LAMBDA", formatUnits(LAMBDA));
	// console.log("Swapping 1000000 EUR to USDC");
	// console.log("Before USDC bal", formatUnits(await usdc.balanceOf(await user1.getAddress()), 6));
	// await eurs.connect(user1).approve(curveEURS.address, ethers.constants.MaxUint256);
	// await curveEURS
	//   .connect(user1)
	//   .originSwap(eurs.address, usdc.address, parseUnits("1000000", TOKENS.EURS.decimals), 0, await getFutureTime());
	// console.log("After USDC bal", formatUnits(await usdc.balanceOf(await user1.getAddress()), 6));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
