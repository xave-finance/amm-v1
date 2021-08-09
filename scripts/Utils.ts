import hre from "hardhat";
const { ethers } = hre;
import { parseUnits } from "@ethersproject/units";
import path from "path";
import mkdirp from "mkdirp";
import fs from "fs";
import { BigNumberish } from "ethers";
import { ERC20 } from "../typechain/ERC20";
import { CurveFactory, Curve } from "../typechain";

import { deployContract } from "./common";

import { CONTRACTS } from "./config/contracts";

const CORE_ADDRESSES = {
  curveFactory: CONTRACTS.factory
}

const QUOTED_TOKEN = 'TOKEN_ADDR_USDC';
const TOKEN = {};
const envList = process.env;

// Initialize token addresses from .env
for (var key in envList) {
  if (key.includes('TOKEN_ADDR')) {
    TOKEN[key] = envList[key];
  }
}

const DIMENSION = {
  alpha: parseUnits(process.env.DIMENSION_ALPHA),
  beta: parseUnits(process.env.DIMENSION_BETA),
  max: parseUnits(process.env.DIMENSION_MAX),
  epsilon: parseUnits(process.env.DIMENSION_EPSILON),
  lambda: parseUnits(process.env.DIMENSION_LAMBDA)
}

export const configFileHelper = async (network, output, directory) => {
  for (var key in output) {
    let data = {};
    const token = key.split('ToUsdAssimilator')[0].toUpperCase();
    const fileName = directory === 'assimilators' ? `${token}ToUsdAssimilator` : `${token}Curves`;
    data[fileName] = output[key];

    // Deployed contracts config
    const outputConfigDir = path.join(__dirname, `./config/${network}/${directory}`);
    mkdirp.sync(outputConfigDir);

    const outputConfigPath = `/${outputConfigDir}/${fileName}.json`;
    fs.writeFileSync(outputConfigPath, JSON.stringify(data, null, 4));
  }
}

export const curveConfig = async (network, tokenSymbol, tokenName) => {
  // List all json files under assimilators config
  const files = fs.readdirSync(path.join(__dirname, `./config/${network}/assimilators`));
  let fileObj = {};

  // Create key value pairs for the fileanems
  for (let index = 0; index < files.length; index++) {
    const fileName = files[index];
    const token = fileName.split('ToUsdAssimilator.json')[0];
    fileObj[token] = fileName;
  }

  let tokenSymbolArr;
  let tokenNameArr;

  if (tokenSymbol.indexOf(',') > -1) {
    tokenSymbolArr = tokenSymbol.split(',');
    tokenNameArr = tokenName.split(',');
  } else {
    tokenSymbolArr = [tokenSymbol];
    tokenNameArr = [tokenName];
  }

  for (let index = 0; index < tokenSymbolArr.length; index++) {
    const tokenSymbol = tokenSymbolArr[index];
    const tokenName = tokenNameArr[index];
    const fullFileName = fileObj[tokenSymbol];
    const fileName = fileObj[tokenSymbol].split('.json')[0];
    const quotedFilename = 'USDCToUsdAssimilator';
    const baseCurveAddr = require(configImporterNew(`assimilators/${fullFileName}`))[fileName];
    const quotedCurveAddr = require(configImporterNew(`assimilators/${quotedFilename}.json`))[quotedFilename];

    const curveFactory = (await ethers.getContractAt(
      "CurveFactory",
      CORE_ADDRESSES.curveFactory,
    )) as CurveFactory;

    const { curve } = await createCurveAndSetParams({
      curveFactory,
      name: tokenName,
      symbol: tokenSymbol,
      base: TOKEN[`TOKEN_ADDR_${tokenSymbol}`],
      quote: TOKEN[QUOTED_TOKEN],
      baseWeight: parseUnits("0.5"),
      quoteWeight: parseUnits("0.5"),
      baseAssimilator: baseCurveAddr,
      quoteAssimilator: quotedCurveAddr,
      params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
    });
  }
}

export const deployedLogs = async (network, filename, output) => {
  // Deployed contracts log
  const outputLogDir = path.join(__dirname, `./deployed_contract_logs/${network}`);
  // Just like mkdir -p, it will create directory if it doesn't exist
  // If it already exists, then it will not print an error and will move further to create sub-directories.
  mkdirp.sync(outputLogDir);

  const timestamp = new Date().getTime().toString();
  const outputLogPath = path.join(`${outputLogDir}/${timestamp}_${filename}.json`);
  fs.writeFileSync(outputLogPath, JSON.stringify(output, null, 4));

  // Deployed contracts config
  const outputConfigDir = path.join(__dirname, `./config/${network}`);
  mkdirp.sync(outputConfigDir);
  const outputConfigPath = `/${outputConfigDir}/${filename}.json`;
  fs.writeFileSync(outputConfigPath, JSON.stringify(output, null, 4));
};

export const configImporter = (filename) => {
  return path.resolve(__dirname, `./config/${hre.network.name}/${filename}.json`);
}

export const configImporterNew = (route) => {
  return path.resolve(__dirname, `./config/${hre.network.name}/${route}`);
}

export const deployerHelper = async (user, contractName) => {
  const contractInstance = await ethers.getContractFactory(contractName);

  const deployed = await deployContract({
    name: contractName,
    deployer: user,
    factory: contractInstance,
    args: [],
    opts: {
      gasLimit: 2000000,
    },
  });

  // Lowercase the first letter of the key
  const key = contractName[0].toLocaleLowerCase() + contractName.slice(1);

  return {
    key,
    address: deployed.address
  }
}

const createCurve = async function ({
  curveFactory,
  name,
  symbol,
  base,
  quote,
  baseWeight,
  quoteWeight,
  baseAssimilator,
  quoteAssimilator,
}: {
  curveFactory: CurveFactory;
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

  console.log('CurveFactory#newCurve TX Hash: ', tx.hash)

  // Get curve address
  const curveAddress = await curveFactory.curves(
    ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "address"], [base, quote])),
  );
  const curveLpToken = (await ethers.getContractAt("ERC20", curveAddress)) as ERC20;
  const curve = (await ethers.getContractAt("Curve", curveAddress)) as Curve;

  const output = {};
  output[symbol.toUpperCase()] = curveAddress;

  // Deployed contracts log
  await configFileHelper(hre.network.name, output, 'curves');

  console.log(`curveAddress ${symbol}: `, curveAddress)
  console.log(`Curve ${symbol} Address: `, curve.address)
  console.log(`Curve LP Token ${symbol} Address:`, curveLpToken.address)

  const turnOffWhitelisting = await curve.turnOffWhitelisting();
  console.log('Curve#turnOffWhitelisting TX Hash: ', turnOffWhitelisting.hash)

  return {
    curve,
    curveLpToken,
  };
};

const createCurveAndSetParams = async function ({
  curveFactory,
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
  curveFactory: CurveFactory;
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
    curveFactory,
    name,
    symbol,
    base,
    quote,
    baseWeight,
    quoteWeight,
    baseAssimilator,
    quoteAssimilator,
  });
  // Set parameters/dimensions here
  const tx = await curve.setParams(...params, { gasLimit: 12000000 });
  console.log('Curve#setParams TX Hash: ', tx.hash)
  await tx.wait();
  return {
    curve,
    curveLpToken,
  };
};