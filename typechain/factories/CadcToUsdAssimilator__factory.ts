/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { CadcToUsdAssimilator } from "../CadcToUsdAssimilator";

export class CadcToUsdAssimilator__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CadcToUsdAssimilator> {
    return super.deploy(overrides || {}) as Promise<CadcToUsdAssimilator>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): CadcToUsdAssimilator {
    return super.attach(address) as CadcToUsdAssimilator;
  }
  connect(signer: Signer): CadcToUsdAssimilator__factory {
    return super.connect(signer) as CadcToUsdAssimilator__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CadcToUsdAssimilator {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as CadcToUsdAssimilator;
  }
}

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "getRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int128",
        name: "_amount",
        type: "int128",
      },
    ],
    name: "intakeNumeraire",
    outputs: [
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_baseWeight",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quoteWeight",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
      {
        internalType: "int128",
        name: "_amount",
        type: "int128",
      },
    ],
    name: "intakeNumeraireLPRatio",
    outputs: [
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "intakeRaw",
    outputs: [
      {
        internalType: "int128",
        name: "amount_",
        type: "int128",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "intakeRawAndGetBalance",
    outputs: [
      {
        internalType: "int128",
        name: "amount_",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "balance_",
        type: "int128",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_dst",
        type: "address",
      },
      {
        internalType: "int128",
        name: "_amount",
        type: "int128",
      },
    ],
    name: "outputNumeraire",
    outputs: [
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "outputRaw",
    outputs: [
      {
        internalType: "int128",
        name: "amount_",
        type: "int128",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_dst",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "outputRawAndGetBalance",
    outputs: [
      {
        internalType: "int128",
        name: "amount_",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "balance_",
        type: "int128",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "viewNumeraireAmount",
    outputs: [
      {
        internalType: "int128",
        name: "amount_",
        type: "int128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "viewNumeraireAmountAndBalance",
    outputs: [
      {
        internalType: "int128",
        name: "amount_",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "balance_",
        type: "int128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "viewNumeraireBalance",
    outputs: [
      {
        internalType: "int128",
        name: "balance_",
        type: "int128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_baseWeight",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quoteWeight",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "viewNumeraireBalanceLPRatio",
    outputs: [
      {
        internalType: "int128",
        name: "balance_",
        type: "int128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int128",
        name: "_amount",
        type: "int128",
      },
    ],
    name: "viewRawAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_baseWeight",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quoteWeight",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
      {
        internalType: "int128",
        name: "_amount",
        type: "int128",
      },
    ],
    name: "viewRawAmountLPRatio",
    outputs: [
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061213c806100206000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80636fc390521161008c578063df4efe4911610066578063df4efe491461046c578063f09a3fc3146104e5578063f5e6c0ca1461054a578063fa00102a1461058f576100ea565b80636fc390521461035d5780637f328ecc146103c2578063ac969a7314610411576100ea565b80631e9b2cba116100c85780631e9b2cba1461021c578063523bf2571461028b578063679aefce146102fa5780636b677a8f14610318576100ea565b8063011847a0146100ef5780630271c3c81461016857806305cf7bb4146101ad575b600080fd5b6101526004803603608081101561010557600080fd5b810190808035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600f0b90602001909291905050506105d4565b6040518082815260200191505060405180910390f35b6101976004803603602081101561017e57600080fd5b810190808035600f0b906020019092919050505061081e565b6040518082815260200191505060405180910390f35b610203600480360360608110156101c357600080fd5b810190808035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506109b6565b6040518082600f0b815260200191505060405180910390f35b6102686004803603604081101561023257600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610c04565b6040518083600f0b815260200182600f0b81526020019250505060405180910390f35b6102d7600480360360408110156102a157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610d1f565b6040518083600f0b815260200182600f0b81526020019250505060405180910390f35b610302610f78565b6040518082815260200191505060405180910390f35b6103476004803603602081101561032e57600080fd5b810190808035600f0b9060200190929190505050611014565b6040518082815260200191505060405180910390f35b6103ac6004803603604081101561037357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600f0b9060200190929190505050611056565b6040518082815260200191505060405180910390f35b6103ee600480360360208110156103d857600080fd5b81019080803590602001909291905050506111d1565b6040518083600f0b815260200182600f0b81526020019250505060405180910390f35b6104536004803603602081101561042757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611440565b6040518082600f0b815260200191505060405180910390f35b6104cf6004803603608081101561048257600080fd5b810190808035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600f0b9060200190929190505050611556565b6040518082815260200191505060405180910390f35b610531600480360360408110156104fb57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506118f6565b6040518082600f0b815260200191505060405180910390f35b6105766004803603602081101561056057600080fd5b8101908080359060200190929190505050611a74565b6040518082600f0b815260200191505060405180910390f35b6105bb600480360360208110156105a557600080fd5b8101908080359060200190929190505050611ab3565b6040518082600f0b815260200191505060405180910390f35b60008073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff166370a08231856040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561065257600080fd5b505afa158015610666573d6000803e3d6000fd5b505050506040513d602081101561067c57600080fd5b81019080805190602001909291905050509050600081116106a1576000915050610816565b600061078586610777670de0b6b3a764000073a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4873ffffffffffffffffffffffffffffffffffffffff166370a082318a6040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561072e57600080fd5b505afa158015610742573d6000803e3d6000fd5b505050506040513d602081101561075857600080fd5b8101908080519060200190929190505050611c4890919063ffffffff16565b611cce90919063ffffffff16565b905060006107e26107b9896107ab670de0b6b3a764000087611c4890919063ffffffff16565b611cce90919063ffffffff16565b6107d4670de0b6b3a764000085611c4890919063ffffffff16565b611cce90919063ffffffff16565b905080620f4240610807670de0b6b3a764000088600f0b611d1890919063ffffffff16565b028161080f57fe5b0493505050505b949350505050565b600080610829610f78565b9050806305f5e10061084f670de0b6b3a764000086600f0b611d1890919063ffffffff16565b028161085757fe5b049150600073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff166323b872dd3330866040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b1580156108ff57600080fd5b505af1158015610913573d6000803e3d6000fd5b505050506040513d602081101561092957600080fd5b81019080805190602001909291905050509050806109af576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f43757276652f434144432d7472616e736665722d66726f6d2d6661696c65640081525060200191505060405180910390fd5b5050919050565b60008073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff166370a08231846040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610a3457600080fd5b505afa158015610a48573d6000803e3d6000fd5b505050506040513d6020811015610a5e57600080fd5b8101908080519060200190929190505050905060008111610a8b57610a836000611dd3565b915050610bfd565b6000610b6f85610b61670de0b6b3a764000073a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4873ffffffffffffffffffffffffffffffffffffffff166370a08231896040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610b1857600080fd5b505afa158015610b2c573d6000803e3d6000fd5b505050506040513d6020811015610b4257600080fd5b8101908080519060200190929190505050611c4890919063ffffffff16565b611cce90919063ffffffff16565b90506000610bcc610ba388610b95670de0b6b3a764000087611c4890919063ffffffff16565b611cce90919063ffffffff16565b610bbe670de0b6b3a764000085611c4890919063ffffffff16565b611cce90919063ffffffff16565b9050610bf7670de0b6b3a7640000620f424083860281610be857fe5b04611df690919063ffffffff16565b93505050505b9392505050565b6000806000610c11610f78565b9050610c3d670de0b6b3a76400006305f5e10083870281610c2e57fe5b04611df690919063ffffffff16565b9250600073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff166370a08231876040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610cbc57600080fd5b505afa158015610cd0573d6000803e3d6000fd5b505050506040513d6020811015610ce657600080fd5b81019080805190602001909291905050509050610d14670de0b6b3a764000082611df690919063ffffffff16565b925050509250929050565b6000806000610d2c610f78565b905060006305f5e10082860281610d3f57fe5b049050600073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff1663a9059cbb88846040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b158015610dc957600080fd5b505af1158015610ddd573d6000803e3d6000fd5b505050506040513d6020811015610df357600080fd5b8101908080519060200190929190505050905080610e79576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f43757276652f434144432d7472616e736665722d6661696c656400000000000081525060200191505060405180910390fd5b600073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610ef657600080fd5b505afa158015610f0a573d6000803e3d6000fd5b505050506040513d6020811015610f2057600080fd5b81019080805190602001909291905050509050610f4e670de0b6b3a764000084611df690919063ffffffff16565b9550610f6b670de0b6b3a764000082611df690919063ffffffff16565b9450505050509250929050565b600073a34317db73e77d453b1b8d04550c44d10e981c8e73ffffffffffffffffffffffffffffffffffffffff166350d25bcd6040518163ffffffff1660e01b815260040160206040518083038186803b158015610fd457600080fd5b505afa158015610fe8573d6000803e3d6000fd5b505050506040513d6020811015610ffe57600080fd5b8101908080519060200190929190505050905090565b60008061101f610f78565b9050806305f5e100611045670de0b6b3a764000086600f0b611d1890919063ffffffff16565b028161104d57fe5b04915050919050565b600080611061610f78565b9050806305f5e100611087670de0b6b3a764000086600f0b611d1890919063ffffffff16565b028161108f57fe5b049150600073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff1663a9059cbb86856040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b15801561111957600080fd5b505af115801561112d573d6000803e3d6000fd5b505050506040513d602081101561114357600080fd5b81019080805190602001909291905050509050806111c9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f43757276652f434144432d7472616e736665722d6661696c656400000000000081525060200191505060405180910390fd5b505092915050565b600080600073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff166323b872dd3330876040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b15801561127957600080fd5b505af115801561128d573d6000803e3d6000fd5b505050506040513d60208110156112a357600080fd5b8101908080519060200190929190505050905080611329576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f43757276652f434144432d7472616e736665722d66726f6d2d6661696c65640081525060200191505060405180910390fd5b600073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156113a657600080fd5b505afa1580156113ba573d6000803e3d6000fd5b505050506040513d60208110156113d057600080fd5b8101908080519060200190929190505050905060006113ed610f78565b905061140a670de0b6b3a764000083611df690919063ffffffff16565b9350611436670de0b6b3a76400006305f5e1008389028161142757fe5b04611df690919063ffffffff16565b9450505050915091565b60008061144b610f78565b9050600073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff166370a08231856040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156114ca57600080fd5b505afa1580156114de573d6000803e3d6000fd5b505050506040513d60208110156114f457600080fd5b8101908080519060200190929190505050905060008111611522576115196000611dd3565b92505050611551565b61154c670de0b6b3a76400006305f5e1008484028161153d57fe5b04611df690919063ffffffff16565b925050505b919050565b60008073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff166370a08231856040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156115d457600080fd5b505afa1580156115e8573d6000803e3d6000fd5b505050506040513d60208110156115fe57600080fd5b81019080805190602001909291905050509050600081116116235760009150506118ee565b6000611707866116f9670de0b6b3a764000073a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4873ffffffffffffffffffffffffffffffffffffffff166370a082318a6040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156116b057600080fd5b505afa1580156116c4573d6000803e3d6000fd5b505050506040513d60208110156116da57600080fd5b8101908080519060200190929190505050611c4890919063ffffffff16565b611cce90919063ffffffff16565b9050600061176461173b8961172d670de0b6b3a764000087611c4890919063ffffffff16565b611cce90919063ffffffff16565b611756670de0b6b3a764000085611c4890919063ffffffff16565b611cce90919063ffffffff16565b905080620f4240611789670de0b6b3a764000088600f0b611d1890919063ffffffff16565b028161179157fe5b049350600073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff166323b872dd3330886040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b15801561183957600080fd5b505af115801561184d573d6000803e3d6000fd5b505050506040513d602081101561186357600080fd5b81019080805190602001909291905050509050806118e9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f43757276652f434144432d7472616e736665722d66726f6d2d6661696c65640081525060200191505060405180910390fd5b505050505b949350505050565b600080611901610f78565b905060006305f5e1008285028161191457fe5b049050600073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff1663a9059cbb87846040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b15801561199e57600080fd5b505af11580156119b2573d6000803e3d6000fd5b505050506040513d60208110156119c857600080fd5b8101908080519060200190929190505050905080611a4e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f43757276652f434144432d7472616e736665722d6661696c656400000000000081525060200191505060405180910390fd5b611a69670de0b6b3a764000083611df690919063ffffffff16565b935050505092915050565b600080611a7f610f78565b9050611aab670de0b6b3a76400006305f5e10083860281611a9c57fe5b04611df690919063ffffffff16565b915050919050565b60008073cadc0acd4b445166f12d2c07eac6e2544fbe2eef73ffffffffffffffffffffffffffffffffffffffff166323b872dd3330866040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b158015611b5957600080fd5b505af1158015611b6d573d6000803e3d6000fd5b505050506040513d6020811015611b8357600080fd5b8101908080519060200190929190505050905080611c09576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f43757276652f636164632d7472616e736665722d66726f6d2d6661696c65640081525060200191505060405180910390fd5b6000611c13610f78565b9050611c3f670de0b6b3a76400006305f5e10083870281611c3057fe5b04611df690919063ffffffff16565b92505050919050565b600080831415611c5b5760009050611cc8565b6000828402905082848281611c6c57fe5b0414611cc3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001806120e66021913960400191505060405180910390fd5b809150505b92915050565b6000611d1083836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250611e5e565b905092915050565b600080821415611d2b5760009050611dcd565b600083600f0b1215611d3c57600080fd5b600060406fffffffffffffffffffffffffffffffff841685600f0b02901c90506000608084901c85600f0b02905077ffffffffffffffffffffffffffffffffffffffffffffffff811115611d8f57600080fd5b604081901b9050817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03811115611dc557600080fd5b818101925050505b92915050565b6000677fffffffffffffff821115611dea57600080fd5b604082901b9050919050565b600080821415611e0557600080fd5b6000611e118484611f24565b90506f7fffffffffffffffffffffffffffffff6fffffffffffffffffffffffffffffffff16816fffffffffffffffffffffffffffffffff161115611e5457600080fd5b8091505092915050565b60008083118290611f0a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015611ecf578082015181840152602081019050611eb4565b50505050905090810190601f168015611efc5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b506000838581611f1657fe5b049050809150509392505050565b600080821415611f3357600080fd5b600077ffffffffffffffffffffffffffffffffffffffffffffffff8411611f695782604085901b81611f6157fe5b0490506120be565b600060c09050600060c086901c90506401000000008110611f9257602081901c90506020820191505b620100008110611faa57601081901c90506010820191505b6101008110611fc157600881901c90506008820191505b60108110611fd757600481901c90506004820191505b60048110611fed57600281901c90506002820191505b60028110611ffc576001820191505b600160bf830360018703901c018260ff0387901b8161201757fe5b0492506fffffffffffffffffffffffffffffffff83111561203757600080fd5b6000608086901c8402905060006fffffffffffffffffffffffffffffffff871685029050600060c089901c9050600060408a901b90508281101561207c576001820391505b8281039050608084901b925082811015612097576001820391505b8281039050608084901c82146120a957fe5b8881816120b257fe5b04870196505050505050505b6fffffffffffffffffffffffffffffffff8111156120db57600080fd5b809150509291505056fe536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77a26469706673582212204bff5c35dcfc9e4032fddd17e55ae78fc4afa2c50207321caca0e55274e52a0b64736f6c63430007030033";
