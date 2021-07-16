const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.kovan') });

import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners() //something

  console.log(`Setting up scaffolding at network ${ethers.provider.connection.url}`);
  console.log(`Deployer account: ${await deployer.getAddress()}`);
  console.log(`Deployer balance: ${await deployer.getBalance()}`);

  const AUD = await ethers.getContractFactory("TokenKovanAud");
  const CHF = await ethers.getContractFactory("TokenKovanChf");
  const EURS = await ethers.getContractFactory("TokenKovanEurs");
  const GBP = await ethers.getContractFactory("TokenKovanGbp");
  const KRW = await ethers.getContractFactory("TokenKovanKrw");
  const JPY = await ethers.getContractFactory("TokenKovanJpy");
  const PKR = await ethers.getContractFactory("TokenKovanPkr");
  const USDC = await ethers.getContractFactory("TokenKovanUsdc");

  const AUDToken = await AUD.deploy();
  const CHFToken = await CHF.deploy();
  const EURSToken = await EURS.deploy();
  const GBPToken = await GBP.deploy();
  const JPYToken = await JPY.deploy();
  const KRWToken = await KRW.deploy();
  const PKRToken = await PKR.deploy();
  const USDCToken = await USDC.deploy();

  console.log('AUDToken.address', AUDToken.address);
  console.log('CHFToken.address', CHFToken.address);
  console.log('EURSToken.address', EURSToken.address);
  console.log('GBPToken.address', GBPToken.address);
  console.log('JPYToken.address', JPYToken.address);
  console.log('KRWToken.address', KRWToken.address);
  console.log('PKRToken.address', PKRToken.address);
  console.log('USDCToken.address', USDCToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });