import { ethers } from "hardhat";
import { getAccounts } from "../common";
import { curveAddresses } from "../Utils";
import { CurveFactory, Curve, ERC20 } from "../../typechain";

const TOKEN_USDC = process.env.TOKEN_ADDR_USDC;
const TOKEN_XSGD = process.env.TOKEN_ADDR_XSGD;

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const curveFactoryAddr = "0xc33745C6cD00C4097faE924CB7e2594FfF4b7d7E";
  const curveFactory = (await ethers.getContractAt("CurveFactory", curveFactoryAddr)) as CurveFactory;

  try {

    // Get curve address
    const curveAddress = await curveFactory.curves(
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "address"], [TOKEN_XSGD, TOKEN_USDC])),
    );

    const curveLpToken = (await ethers.getContractAt("ERC20", curveAddress)) as ERC20;

    console.log("Curve Address: ", curveAddress);
    console.log(`Curve LP Token Address:`, curveLpToken.address)

    console.log('\r');
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