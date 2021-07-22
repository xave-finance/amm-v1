require("dotenv").config(); // eslint-disable-line
import "hardhat-typechain";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

const MNEMONIC = process.env.MNEMONIC;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn moreww
const config: HardhatUserConfig = {
  solidity: {
    version: "0.7.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      timeout: 1200000,
      accounts: {
        mnemonic: MNEMONIC,
        accountsBalance: "100000000000000000000000",
      },
    },
    remote: {
      url: process.env["REMOTE_URL"] ? process.env["REMOTE_URL"] : "http://127.0.0.1:8545",
      accounts: [
        process.env["PRIVATE_KEY"]
          ? process.env["PRIVATE_KEY"]
          : "0000000000000000000000000000000000000000000000000000000000000001",
      ],
    },
    hardhat: {
      chainId: 1,
      accounts: {
        mnemonic: MNEMONIC,
        accountsBalance: "100000000000000000000000",
      },
      forking: {
        enabled: true,
        url: process.env["RPC_URL"] ? process.env["RPC_URL"] : "http://127.0.0.1:8545",
      },
      blockGasLimit: 20000000,
      allowUnlimitedContractSize: true,
    },
    kovan: {
      url: process.env["RPC_URL"],
      accounts: {
        mnemonic: MNEMONIC
      },
      blockGasLimit: 20000000
    }
  },
  mocha: {
    timeout: 1200000,
  },
};

export default config;
