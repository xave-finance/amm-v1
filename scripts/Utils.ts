import hre, { network } from "hardhat";
const { ethers } = hre;
import { parseUnits } from "@ethersproject/units";
import { formatUnits } from "ethers/lib/utils";
import path from "path";
import mkdirp from "mkdirp";
import fs from "fs";
import { BigNumberish } from "ethers";
import { ERC20 } from "../typechain/ERC20";
import { CurveFactory, Curve } from "../typechain";
import { deployContract, getFastGasPrice } from "./common";

const NETWORK = hre.network.name;
const QUOTED_TOKEN = 'TOKEN_ADDR_USDC';
const TOKEN = {};
const LPT_SYMBOL = process.env.LPT_SYMBOL;
const LPT_NAME = process.env.LPT_NAME;
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

export const configFileHelper = async (output, directory) => {
  for (var key in output) {
    let data = {};
    const token = key.split('ToUsdAssimilator')[0].toUpperCase();
    const fileName = directory === 'assimilators' ? `${token}ToUsdAssimilator` : `${token}Curves`;
    data[fileName] = output[key];

    // Deployed contracts log
    await logHelper(fileName, data);

    // Deployed contracts config
    const outputConfigDir = path.join(__dirname, `./config/${NETWORK}/${directory}`);
    mkdirp.sync(outputConfigDir);

    const outputConfigPath = `/${outputConfigDir}/${fileName}.json`;
    fs.writeFileSync(outputConfigPath, JSON.stringify(data, null, 4));
  }
}

export const curveConfig = async (tokenSymbol, tokenName, curveWeights, lptNames) => {
  const { CONTRACTS } = require(path.resolve(__dirname, `./config/contracts`));
  const CORE_ADDRESSES = {
    curveFactory: CONTRACTS.factory
  }

  // List all json files under assimilators config
  const files = fs.readdirSync(path.join(__dirname, `./config/${NETWORK}/assimilators`));
  let fileObj = await listFiles('assimilators', 'ToUsdAssimilator.json');

  let tokenSymbolArr;
  let tokenNameArr;
  let curveWeightsArr;
  let lptNamesArr;

  if (tokenSymbol.indexOf(',') > -1) {
    tokenSymbolArr = tokenSymbol.split(',');
    tokenNameArr = tokenName.split(',');
    curveWeightsArr = curveWeights.split(',');
    lptNamesArr = lptNames.split(',');
  } else {
    tokenSymbolArr = [tokenSymbol];
    tokenNameArr = [tokenName];
    curveWeightsArr = [curveWeights];
    lptNamesArr = [lptNames];
  }

  for (let index = 0; index < tokenSymbolArr.length; index++) {
    const tokenSymbol = tokenSymbolArr[index];

    if (tokenSymbol !== 'USDC') {
      const weightArr = curveWeightsArr[index].split('/');
      const baseWeight = toDecimal(weightArr[0]).toString();
      const quoteWeight = toDecimal(weightArr[1]).toString();
      const tokenName = tokenNameArr[index];
      const fullFileName = fileObj[tokenSymbol];
      const fileName = fileObj[tokenSymbol].split('.json')[0];
      const quotedFilename = 'USDCToUsdAssimilator';
      const baseCurveAddr = require(configImporterNew(`assimilators/${fullFileName}`))[fileName];
      const quotedCurveAddr = require(configImporterNew(`assimilators/${quotedFilename}.json`))[quotedFilename];
      const lptName = lptNamesArr[index];

      const curveFactory = (await ethers.getContractAt(
        "CurveFactory",
        CORE_ADDRESSES.curveFactory,
      )) as CurveFactory;

      const { curve } = await createCurveAndSetParams({
        curveFactory,
        lptName,
        name: tokenName,
        symbol: tokenSymbol,
        base: TOKEN[`TOKEN_ADDR_${tokenSymbol}`],
        quote: TOKEN[QUOTED_TOKEN],
        baseWeight: parseUnits(baseWeight),
        quoteWeight: parseUnits(quoteWeight),
        baseAssimilator: baseCurveAddr,
        quoteAssimilator: quotedCurveAddr,
        params: [DIMENSION.alpha, DIMENSION.beta, DIMENSION.max, DIMENSION.epsilon, DIMENSION.lambda],
      });
    }
  }
}

export const deployedLogs = async (filename, output) => {
  // Deployed contracts log
  await logHelper(filename, output);

  // Deployed contracts config
  const outputConfigDir = path.join(__dirname, `./config/${NETWORK}`);
  mkdirp.sync(outputConfigDir);
  const outputConfigPath = `/${outputConfigDir}/${filename}.json`;
  fs.writeFileSync(outputConfigPath, JSON.stringify(output, null, 4));
};

export const configImporter = (filename) => {
  return path.resolve(__dirname, `./config/${NETWORK}/${filename}.json`);
}

export const configImporterNew = (route) => {
  return path.resolve(__dirname, `./config/${NETWORK}/${route}`);
}

export const deployerHelper = async (user, contractName) => {
  const contractInstance = await ethers.getContractFactory(contractName);

  const deployed = await deployContract({
    name: contractName,
    deployer: user,
    factory: contractInstance,
    args: [],
    opts: {
      gasLimit: 3000000,
    },
  });

  // Lowercase the first letter of the key
  const key = contractName[0].toLocaleLowerCase() + contractName.slice(1);

  return {
    key,
    address: deployed.address
  }
}

export const listFiles = async (directory, fileSuffix) => {
  // List all json files under assimilators config
  const files = fs.readdirSync(path.join(__dirname, `./config/${NETWORK}/${directory}`));
  let fileObj = {};

  // Create key value pairs for the fileanems
  for (let index = 0; index < files.length; index++) {
    const fileName = files[index];
    const token = fileName.split(fileSuffix)[0];
    fileObj[token] = fileName;
  }

  return fileObj;
}

export const curveAddresses = async () => {
  let curves = {};
  const fileObj = await listFiles('curves', 'Curves.json');

  Object.keys(fileObj).map(key => {
    let curveAddr = require(configImporterNew(`curves/${fileObj[key]}`))
    curves[key] = curveAddr[Object.keys(curveAddr)[0]];
  });

  return curves;
}

const logHelper = async (filename, output) => {
  // Deployed contracts log
  const outputLogDir = path.join(__dirname, `./deployed_contract_logs/${NETWORK}`);
  // Just like mkdir -p, it will create directory if it doesn't exist
  // If it already exists, then it will not print an error and will move further to create sub-directories.
  mkdirp.sync(outputLogDir);

  const timestamp = new Date().getTime().toString();
  const outputLogPath = path.join(`${outputLogDir}/${timestamp}_${filename}.json`);
  fs.writeFileSync(outputLogPath, JSON.stringify(output, null, 4));
}

const toDecimal = (n) => {
  var l = n.toString().length;
  var v = n / Math.pow(10, l);
  return v;
}

const createCurve = async function ({
  curveFactory,
  lptName,
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
  lptName: string;
  name: string;
  symbol: string;
  base: string;
  quote: string;
  baseWeight: BigNumberish;
  quoteWeight: BigNumberish;
  baseAssimilator: string;
  quoteAssimilator: string;
}): Promise<{ curve: Curve; curveLpToken: ERC20 }> {
  const gasPrice = await getFastGasPrice();

  console.log(`Deploying curve ${lptName} with gasPrice ${formatUnits(gasPrice, 9)} gwei`);

  const tx = await curveFactory.newCurve(
    lptName,
    LPT_SYMBOL,
    base,
    quote,
    baseWeight,
    quoteWeight,
    baseAssimilator,
    quoteAssimilator,
    {
      gasPrice
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
  await configFileHelper(output, 'curves');

  console.log(`curveAddress ${symbol}: `, curveAddress)
  console.log(`Curve ${symbol} Address: `, curve.address)
  console.log(`Curve LP Token ${symbol} Address:`, curveLpToken.address)

  // Turn off whitelisting
  const gasPrice2 = await getFastGasPrice();
  console.log(`Curve#turnOffWhitelisting with gasPrice ${formatUnits(gasPrice2, 9)} gwei`);
  const turnOffWhitelisting = await curve.turnOffWhitelisting({ gasPrice: gasPrice2 });
  console.log('Curve#turnOffWhitelisting TX Hash: ', turnOffWhitelisting.hash)

  // Set Cap
  const gasPrice3 = await getFastGasPrice();
  console.log(`Curve#setCap with gasPrice ${formatUnits(gasPrice3, 9)} gwei`);
  const cap = parseUnits("500000");
  const setCap = await curve.setCap(cap, { gasPrice: gasPrice3 });
  console.log('Curve#setCap TX Hash: ', setCap.hash)

  return {
    curve,
    curveLpToken,
  };
};

const createCurveAndSetParams = async function ({
  curveFactory,
  lptName,
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
  lptName: string,
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
    lptName,
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
  const gasPrice = await getFastGasPrice();

  console.log(`Curve#setParams with gasPrice ${formatUnits(gasPrice, 9)} gwei`);

  const tx = await curve.setParams(...params, { gasPrice });
  console.log('Curve#setParams TX Hash: ', tx.hash)
  await tx.wait();
  return {
    curve,
    curveLpToken,
  };
};