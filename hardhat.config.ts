require("dotenv").config(); // eslint-disable-line
import "hardhat-typechain";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import 'hardhat-gas-reporter';

const RPC_URL = process.env.RPC_URL;
const MNEMONIC = process.env.MNEMONIC;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const LOCALHOST = "http://127.0.0.1:8545";

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
      url: LOCALHOST,
      timeout: 1200000,
      accounts: {
        mnemonic: MNEMONIC,
        accountsBalance: "100000000000000000000000",
      },
    },
    remote: {
      url: RPC_URL ? RPC_URL : LOCALHOST,
      accounts: {
        mnemonic: MNEMONIC
      },
    },
    hardhat: {
      chainId: 1,
      accounts: {
        mnemonic: MNEMONIC,
        accountsBalance: "100000000000000000000000",
      },
      forking: {
        enabled: true,
        url: RPC_URL ? RPC_URL : LOCALHOST,
        blockNumber: 12640151 // https://etherscan.io/block/12640151
      },
      blockGasLimit: 20000000,
      allowUnlimitedContractSize: true,
    },
    kovan: {
      url: RPC_URL,
      accounts: {
        mnemonic: MNEMONIC
      },
      blockGasLimit: 20000000
    },
    mainnet: {
      url: RPC_URL,
      chainId: 1,
      accounts: {
        mnemonic: MNEMONIC
      }
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  mocha: {
    timeout: 1200000,
  },
};

export default config;
