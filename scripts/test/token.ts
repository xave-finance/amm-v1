import { ethers } from "hardhat";
import { getAccounts, deployContract, getFastGasPrice } from "../common";
import { parseUnits } from "ethers/lib/utils";

async function main() {
  console.time('Deployment Time');
  const users = await getAccounts();
  const user1 = users[0];
  const TokenFactory = await ethers.getContractFactory("MockToken",);
  const tokens = {
    eurs: {
      name: "STASIS EURS Token",
      symbol: "EURS",
      decimal: 2,
    },
    xsgd: {
      name: "XSGD",
      symbol: "XSGD",
      decimal: 6,
    },
    cadc: {
      name: "CAD Coin",
      symbol: "CADC",
      decimal: 18
    },
    fxphp: {
      name: "Philippine Peso",
      symbol: "FXPHP",
      decimal: 18,
    }
  }

  for (const [key, value] of Object.entries(tokens)) {
    const token = await deployContract({
      name: "ERC20",
      deployer: user1,
      factory: TokenFactory,
      args: [value.name, value.symbol, value.decimal],
      opts: {
        gasLimit: 4000000,
        gasPrice: parseUnits("150", 9)
      },
    });

    console.log(`${value.name}: `, token.address);
  }

  const usdc = "0x27A21D32375Ab8e3aFaa97B3635747d1F7e10531";
  const eurs = "0xd2FE1C2C56D9d20F7623601D919334D20f8027a9";
  const xsgd = "0xAed9698535F545Fce2fe950168bFc6C301F60580";
  const cadc = "0x97611913916AF0F867109F8ebF278d3B71C4e720";
  const fxphp = "0x62daF92A667c01567684Ef77eE590F1095393701";
  const arr = [usdc, eurs, xsgd, cadc, fxphp];

  for (let index = 0; index < arr.length; index++) {
    const row = arr[index];

    const token = row;
    const contract = await (await ethers.getContractFactory("MockToken")).attach(token);

    const gasPrice = await getFastGasPrice();
    const mint = await (await contract.mint(user1.address, parseUnits("99000000"), {
      gasLimit: 4000000,
      gasPrice: parseUnits("150", 9)
    }));
    console.log("mint", mint.hash);
  }

  console.timeEnd('Deployment Time');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });