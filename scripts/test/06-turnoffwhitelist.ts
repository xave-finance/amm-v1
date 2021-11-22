import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { getAccounts } from "../common";
import { curveAddresses } from "../Utils";

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const curves = await curveAddresses();
  const TOKEN = 'FXPHP';

  const curve = (await ethers.getContractAt("Curve", curves[TOKEN])) as Curve;

  try {
    // Turn off whitelisting
    console.log('\r');
    const tx = await curve.turnOffWhitelisting();
    console.log(`Curve${TOKEN}#turnOffWhitelisting TX Hash: `, tx.hash);

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