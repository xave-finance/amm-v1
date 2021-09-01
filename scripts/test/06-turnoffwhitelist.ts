import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { getAccounts } from "../common";
import { curveAddresses } from "../Utils";

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const curves = await curveAddresses();

  const curveXSGD = (await ethers.getContractAt("Curve", curves['XSGD'])) as Curve;
  const curveTCAD = (await ethers.getContractAt("Curve", curves['TCAD'])) as Curve;
  const curveTAUD = (await ethers.getContractAt("Curve", curves['TAUD'])) as Curve;
  const curveTGBP = (await ethers.getContractAt("Curve", curves['TGBP'])) as Curve;
  const curveTUSD = (await ethers.getContractAt("Curve", curves['TUSD'])) as Curve;

  try {
    // Turn off whitelisting
    // console.log('\r');
    // const toCurveXSGD = await curveXSGD.turnOffWhitelisting();
    // console.log('toCurveXSGD#turnOffWhitelisting TX Hash: ', toCurveXSGD.hash)

    console.log('\r');
    const toCurveTCAD = await curveTCAD.turnOffWhitelisting();
    console.log('toCurveTCAD#turnOffWhitelisting TX Hash: ', toCurveTCAD.hash)

    console.log('\r');
    const toCurveTAUD = await curveTAUD.turnOffWhitelisting();
    console.log('toCurveTAUD#turnOffWhitelisting TX Hash: ', toCurveTAUD.hash)

    console.log('\r');
    const toCurveTGBP = await curveTGBP.turnOffWhitelisting();
    console.log('toCurveTGBP#turnOffWhitelisting TX Hash: ', toCurveTGBP.hash)

    console.log('\r');
    const toCurveTUSD = await curveTUSD.turnOffWhitelisting();
    console.log('toCurveTUSD#turnOffWhitelisting TX Hash: ', toCurveTUSD.hash)

    console.timeEnd('Deployment Time');
  } catch (error) {
    console.log(error);
    console.timeEnd('Deployment Time');
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });