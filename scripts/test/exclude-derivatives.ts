import { ethers } from "hardhat";
import { Curve } from "../../typechain/Curve";
import { getAccounts } from "../common";
import { curveAddresses } from "../Utils";

const TOKEN_USDC = process.env.TOKEN_ADDR_USDC;

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const curves = await curveAddresses();
  const TOKEN = 'XSGD';

  const curve = (await ethers.getContractAt("Curve", curves[TOKEN])) as Curve;

  try {
    console.log('\r');

    try {
      const tx = await curve.excludeDerivative(TOKEN_USDC, { gasLimit: 12000000 });
      console.log("tx hash", tx.hash);
      await tx.wait();
      console.log(`${TOKEN} derivative xcluded`);
    } catch (error) {
      console.log(`Error: ${error}`);
    }

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