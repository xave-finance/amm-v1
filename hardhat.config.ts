const netObj = JSON.parse(process.env.npm_config_argv).original;
const NETWORK = netObj[netObj.length - 1];
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), `.env.${NETWORK}`) });

import "hardhat-typechain";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";

const RPC_URL_KOVAN = process.env.RPC_URL_KOVAN;
const LOCAL_NODE = process.env.LOCAL_NODE;
const PRIVATE_KEY_MAINNET = process.env.PRIVATE_KEY_MAINNET;
const PRIVATE_KEY2_MAINNET = process.env.PRIVATE_KEY2_MAINNET;
const PRIVATE_KEY_KOVAN = process.env.PRIVATE_KEY_KOVAN;
const PRIVATE_KEY2_KOVAN = process.env.PRIVATE_KEY2_KOVAN;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

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
      url: LOCAL_NODE,
      timeout: 1200000,
      accounts: [`0x${PRIVATE_KEY_MAINNET}`, `0x${PRIVATE_KEY2_MAINNET}`],
    },
    remote: {
      url: process.env["REMOTE_URL"] ? process.env["REMOTE_URL"] : LOCAL_NODE,
      accounts: [
        process.env["PRIVATE_KEY"]
          ? process.env["PRIVATE_KEY"]
          : "0000000000000000000000000000000000000000000000000000000000000001",
      ],
    },
    hardhat: {
      chainId: 1,
      accounts: {
        mnemonic: "myth like bonus scare over problem client lizard pioneer submit female collect",
        accountsBalance: "100000000000000000000000",
      },
      forking: {
        enabled: true,
        url: process.env["RPC_URL_MAINNET"] ? process.env["RPC_URL_MAINNET"] : LOCAL_NODE,
        blockNumber: 12640151 // https://etherscan.io/block/12640151
      },
      blockGasLimit: 20000000,
      allowUnlimitedContractSize: true,
    },
    kovan: {
      url: RPC_URL_KOVAN,
      accounts: [`0x${PRIVATE_KEY_KOVAN}`, `0x${PRIVATE_KEY2_KOVAN}`],
      blockGasLimit: 20000000
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  mocha: {
    timeout: 1200000,
  },
};

export default config;
