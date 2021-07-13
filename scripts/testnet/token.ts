require("dotenv").config();
import { ethers } from "hardhat";
import { Signer } from "ethers";

const netObj = JSON.parse(process.env.npm_config_argv).original;
const NETWORK = netObj[netObj.length - 1]

const LOCAL_NODE = process.env.LOCAL_NODE;
const provider = new ethers.providers.JsonRpcProvider(LOCAL_NODE);

export const getDeployer = async (): Promise<{
  deployer: Signer;
  user1: Signer
}> => {
  const [deployer, user1] = await ethers.getSigners();
  return {
    deployer,
    user1
  };
};

async function main() {
  let _deployer: any;
  let _user1: any;

  if (NETWORK === 'localhost') {
    _deployer = await provider.getSigner();
    _user1 = await provider.getSigner(1);
  } else {
    const { deployer, user1 } = await getDeployer();
    _deployer = deployer;
    _user1 = user1;
  }

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await _deployer.getAddress()}`);
  console.log(`Deployer balance: ${await _deployer.getBalance()}`)
  console.log(`User1 account: ${await _user1.getAddress()}`);
  console.log(`User1 balance: ${await _user1.getBalance()}`)


  const JPY = await ethers.getContractFactory("JPY");
  const USDC = await ethers.getContractFactory("USDC");

  const JPYToken = await JPY.deploy();
  const USDCToken = await USDC.deploy();

  console.log(JPYToken.address);
  console.log(USDCToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
