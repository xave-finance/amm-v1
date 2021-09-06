const hre = require("hardhat");
import { parseUnits } from "@ethersproject/units";
import { CONTRACTS } from "./config/contracts";
import { configImporterNew } from "./Utils";

const QUOTED_TOKEN = 'TOKEN_ADDR_USDC';
const ASSIMILATORS = process.env.ASSIMILATORS;
let assimilators = ASSIMILATORS.indexOf(',') > -1 ? ASSIMILATORS.split(',') : [ASSIMILATORS];

const coreVerify = async () => {
  for (const key in CONTRACTS) {
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`-------------------- Verifying ${key} Core Contract`);
    console.log(`--------------------------------------------------------------------------------`);

    try {
      if (key === 'router') {
        await hre.run('verify:verify', {
          address: CONTRACTS.router,
          constructorArguments: [
            CONTRACTS.factory
          ]
        });
      } else {
        await hre.run('verify:verify', {
          address: CONTRACTS[key]
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      continue;
    }
  }

  return;
}

const assimilatorsVerify = async () => {
  for (let index = 0; index < assimilators.length; index++) {
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`-------------------- Verifying ${assimilators[index]} Assimilator Contract`);
    console.log(`--------------------------------------------------------------------------------`);

    try {
      const token = assimilators[index].split('ToUsdAssimilator')[0].toUpperCase();
      const fileName = `${token}ToUsdAssimilator`;
      const curveAddr = require(configImporterNew(`assimilators/${fileName}.json`))[fileName];

      await hre.run('verify:verify', {
        address: curveAddr
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      continue;
    }
  }

  return;
}

const curvesVerify = async () => {
  const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL;
  const TOKEN_NAME = process.env.TOKEN_NAME;

  let tokenSymbolArr;
  let tokenNameArr;

  const TOKEN = {};
  const envList = process.env;

  // Initialize token addresses from .env
  for (var key in envList) {
    if (key.includes('TOKEN_ADDR')) {
      TOKEN[key] = envList[key];
    }
  }

  if (TOKEN_SYMBOL.indexOf(',') > -1) {
    tokenSymbolArr = TOKEN_SYMBOL.split(',');
    tokenNameArr = TOKEN_NAME.split(',');
  } else {
    tokenSymbolArr = [TOKEN_SYMBOL];
    tokenNameArr = [TOKEN_NAME];
  }

  for (let index = 0; index < tokenSymbolArr.length; index++) {
    try {
      const tokenSymbol = tokenSymbolArr[index];

      if (tokenSymbol !== 'USDC') {
        console.log(`--------------------------------------------------------------------------------`);
        console.log(`-------------------- Verifying ${tokenSymbol} Curve Contract`);
        console.log(`--------------------------------------------------------------------------------`);

        const fileName = `${tokenSymbol}Curves`;
        const fullFileName = `${fileName}.json`;
        const curveAddr = require(configImporterNew(`oq_curves/${fullFileName}`))[fileName];
        const token = assimilators[index].split('ToUsdAssimilator')[0].toUpperCase();
        const assimfileName = `${token}ToUsdAssimilator`;
        const assimAddr = require(configImporterNew(`assimilators/${assimfileName}.json`))[assimfileName];
        const quotedAssimAddr = require(configImporterNew(`assimilators/USDCToUsdAssimilator.json`))['USDCToUsdAssimilator'];

        await hre.run('verify:verify', {
          address: curveAddr,
          constructorArguments: [
            tokenNameArr[index],
            tokenSymbol,
            [
              TOKEN[`TOKEN_ADDR_${tokenSymbol}`],
              assimAddr,
              TOKEN[`TOKEN_ADDR_${tokenSymbol}`],
              assimAddr,
              TOKEN[`TOKEN_ADDR_${tokenSymbol}`],

              TOKEN[QUOTED_TOKEN],
              quotedAssimAddr,
              TOKEN[QUOTED_TOKEN],
              quotedAssimAddr,
              TOKEN[QUOTED_TOKEN],
            ],
            [
              parseUnits("0.5"),
              parseUnits("0.5"),
            ]
          ]
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      continue;
    }
  }

  // SIGILL error fix
  return;
}

async function main() {
  // Core Contracts
  await coreVerify();

  // Assimilators
  await assimilatorsVerify();

  // Curves
  await curvesVerify();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });