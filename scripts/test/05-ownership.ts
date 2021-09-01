import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { getAccounts } from "../common";
import { curveAddresses } from "../Utils";

const GOVERNANCE_ADDRESS = process.env.GOVERNANCE_ADDRESS;

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
    // Change ownership
    console.log('\r');
    const txCurveXSGD = await curveXSGD.transferOwnership(GOVERNANCE_ADDRESS, { gasLimit: 12000000 });
    console.log("tx hash", txCurveXSGD.hash);
    await txCurveXSGD.wait();
    console.log("XSGD ownership xferred");

    console.log('\r');
    const txCurveTCAD = await curveTCAD.transferOwnership(GOVERNANCE_ADDRESS, { gasLimit: 12000000 });
    console.log("tx hash", txCurveTCAD.hash);
    await txCurveTCAD.wait();
    console.log("TCAD ownership xferred");

    console.log('\r');
    const txCurveTAUD = await curveTAUD.transferOwnership(GOVERNANCE_ADDRESS, { gasLimit: 12000000 });
    console.log("tx hash", txCurveTAUD.hash);
    await txCurveTAUD.wait();
    console.log("TAUD ownership xferred");

    console.log('\r');
    const txCurveTGBP = await curveTGBP.transferOwnership(GOVERNANCE_ADDRESS, { gasLimit: 12000000 });
    console.log("tx hash", txCurveTGBP.hash);
    await txCurveTGBP.wait();
    console.log("TGBP ownership xferred");

    console.log('\r');
    const txCurveTUSD = await curveTUSD.transferOwnership(GOVERNANCE_ADDRESS, { gasLimit: 12000000 });
    console.log("tx hash", txCurveTUSD.hash);
    await txCurveTUSD.wait();
    console.log("TUSD ownership xferred");

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