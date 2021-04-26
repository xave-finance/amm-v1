/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { XsgdToUsdAssimilator } from "../XsgdToUsdAssimilator";

export class XsgdToUsdAssimilator__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<XsgdToUsdAssimilator> {
    return super.deploy(overrides || {}) as Promise<XsgdToUsdAssimilator>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): XsgdToUsdAssimilator {
    return super.attach(address) as XsgdToUsdAssimilator;
  }
  connect(signer: Signer): XsgdToUsdAssimilator__factory {
    return super.connect(signer) as XsgdToUsdAssimilator__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): XsgdToUsdAssimilator {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as XsgdToUsdAssimilator;
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
  "0x608060405234801561001057600080fd5b5061212c806100206000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80636fc390521161008c578063df4efe4911610066578063df4efe491461046c578063f09a3fc3146104e5578063f5e6c0ca1461054a578063fa00102a1461058f576100ea565b80636fc390521461035d5780637f328ecc146103c2578063ac969a7314610411576100ea565b80631e9b2cba116100c85780631e9b2cba1461021c578063523bf2571461028b578063679aefce146102fa5780636b677a8f14610318576100ea565b8063011847a0146100ef5780630271c3c81461016857806305cf7bb4146101ad575b600080fd5b6101526004803603608081101561010557600080fd5b810190808035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600f0b90602001909291905050506105d4565b6040518082815260200191505060405180910390f35b6101976004803603602081101561017e57600080fd5b810190808035600f0b9060200190929190505050610817565b6040518082815260200191505060405180910390f35b610203600480360360608110156101c357600080fd5b810190808035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506109aa565b6040518082600f0b815260200191505060405180910390f35b6102686004803603604081101561023257600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610bf8565b6040518083600f0b815260200182600f0b81526020019250505060405180910390f35b6102d7600480360360408110156102a157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610d09565b6040518083600f0b815260200182600f0b81526020019250505060405180910390f35b610302610f58565b6040518082815260200191505060405180910390f35b6103476004803603602081101561032e57600080fd5b810190808035600f0b9060200190929190505050611033565b6040518082815260200191505060405180910390f35b6103ac6004803603604081101561037357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600f0b9060200190929190505050611070565b6040518082815260200191505060405180910390f35b6103ee600480360360208110156103d857600080fd5b81019080803590602001909291905050506111e6565b6040518083600f0b815260200182600f0b81526020019250505060405180910390f35b6104536004803603602081101561042757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061144b565b6040518082600f0b815260200191505060405180910390f35b6104cf6004803603608081101561048257600080fd5b810190808035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600f0b906020019092919050505061155c565b6040518082815260200191505060405180910390f35b610531600480360360408110156104fb57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506118f5565b6040518082600f0b815260200191505060405180910390f35b6105766004803603602081101561056057600080fd5b8101908080359060200190929190505050611a6e565b6040518082600f0b815260200191505060405180910390f35b6105bb600480360360208110156105a557600080fd5b8101908080359060200190929190505050611aa8565b6040518082600f0b815260200191505060405180910390f35b6000807370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166370a08231856040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561065257600080fd5b505afa158015610666573d6000803e3d6000fd5b505050506040513d602081101561067c57600080fd5b81019080805190602001909291905050509050600081116106a157600091505061080f565b6106ce866106c0670de0b6b3a764000084611c3890919063ffffffff16565b611cbe90919063ffffffff16565b905060006107b4866107a6670de0b6b3a764000073a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4873ffffffffffffffffffffffffffffffffffffffff166370a082318a6040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561075d57600080fd5b505afa158015610771573d6000803e3d6000fd5b505050506040513d602081101561078757600080fd5b8101908080519060200190929190505050611c3890919063ffffffff16565b611cbe90919063ffffffff16565b905060006107e0836107d2620f424085611c3890919063ffffffff16565b611cbe90919063ffffffff16565b905080620f4240610800620f424088600f0b611d0890919063ffffffff16565b028161080857fe5b0493505050505b949350505050565b600080610822610f58565b9050806305f5e100610843620f424086600f0b611d0890919063ffffffff16565b028161084b57fe5b04915060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330866040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b1580156108f357600080fd5b505af1158015610907573d6000803e3d6000fd5b505050506040513d602081101561091d57600080fd5b81019080805190602001909291905050509050806109a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f43757276652f585347442d7472616e736665722d66726f6d2d6661696c65640081525060200191505060405180910390fd5b5050919050565b6000807370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166370a08231846040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610a2857600080fd5b505afa158015610a3c573d6000803e3d6000fd5b505050506040513d6020811015610a5257600080fd5b8101908080519060200190929190505050905060008111610a7f57610a776000611dc3565b915050610bf1565b6000610b6385610b55670de0b6b3a764000073a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4873ffffffffffffffffffffffffffffffffffffffff166370a08231896040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610b0c57600080fd5b505afa158015610b20573d6000803e3d6000fd5b505050506040513d6020811015610b3657600080fd5b8101908080519060200190929190505050611c3890919063ffffffff16565b611cbe90919063ffffffff16565b90506000610bc0610b9788610b89670de0b6b3a764000087611c3890919063ffffffff16565b611cbe90919063ffffffff16565b610bb2670de0b6b3a764000085611c3890919063ffffffff16565b611cbe90919063ffffffff16565b9050610beb670de0b6b3a7640000620f424083860281610bdc57fe5b04611de690919063ffffffff16565b93505050505b9392505050565b6000806000610c05610f58565b9050610c2c620f42406305f5e10083870281610c1d57fe5b04611de690919063ffffffff16565b925060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166370a08231876040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610cab57600080fd5b505afa158015610cbf573d6000803e3d6000fd5b505050506040513d6020811015610cd557600080fd5b81019080805190602001909291905050509050610cfe620f424082611de690919063ffffffff16565b925050509250929050565b6000806000610d16610f58565b905060006305f5e10082860281610d2957fe5b04905060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb88846040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b158015610db357600080fd5b505af1158015610dc7573d6000803e3d6000fd5b505050506040513d6020811015610ddd57600080fd5b8101908080519060200190929190505050905080610e63576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f43757276652f585347442d7472616e736665722d6661696c656400000000000081525060200191505060405180910390fd5b60007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610ee057600080fd5b505afa158015610ef4573d6000803e3d6000fd5b505050506040513d6020811015610f0a57600080fd5b81019080805190602001909291905050509050610f33620f424084611de690919063ffffffff16565b9550610f4b620f424082611de690919063ffffffff16565b9450505050509250929050565b60008060008060008073e25277ff4bbf9081c75ab0eb13b4a13a721f3e1373ffffffffffffffffffffffffffffffffffffffff1663feaf968c6040518163ffffffff1660e01b815260040160a06040518083038186803b158015610fbb57600080fd5b505afa158015610fcf573d6000803e3d6000fd5b505050506040513d60a0811015610fe557600080fd5b81019080805190602001909291908051906020019092919080519060200190929190805190602001909291908051906020019092919050505094509450945094509450839550505050505090565b60008061103e610f58565b9050806305f5e10061105f620f424086600f0b611d0890919063ffffffff16565b028161106757fe5b04915050919050565b60008061107b610f58565b9050806305f5e10061109c620f424086600f0b611d0890919063ffffffff16565b02816110a457fe5b04915060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb86856040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b15801561112e57600080fd5b505af1158015611142573d6000803e3d6000fd5b505050506040513d602081101561115857600080fd5b81019080805190602001909291905050509050806111de576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f43757276652f585347442d7472616e736665722d6661696c656400000000000081525060200191505060405180910390fd5b505092915050565b60008060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330876040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b15801561128e57600080fd5b505af11580156112a2573d6000803e3d6000fd5b505050506040513d60208110156112b857600080fd5b810190808051906020019092919050505090508061133e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f43757276652f585347442d7472616e736665722d66726f6d2d6661696c65640081525060200191505060405180910390fd5b60007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156113bb57600080fd5b505afa1580156113cf573d6000803e3d6000fd5b505050506040513d60208110156113e557600080fd5b810190808051906020019092919050505090506000611402610f58565b905061141a620f424083611de690919063ffffffff16565b9350611441620f42406305f5e1008389028161143257fe5b04611de690919063ffffffff16565b9450505050915091565b600080611456610f58565b905060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166370a08231856040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156114d557600080fd5b505afa1580156114e9573d6000803e3d6000fd5b505050506040513d60208110156114ff57600080fd5b810190808051906020019092919050505090506000811161152d576115246000611dc3565b92505050611557565b611552620f42406305f5e1008484028161154357fe5b04611de690919063ffffffff16565b925050505b919050565b6000807370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166370a08231856040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156115da57600080fd5b505afa1580156115ee573d6000803e3d6000fd5b505050506040513d602081101561160457600080fd5b81019080805190602001909291905050509050600081116116295760009150506118ed565b61165686611648670de0b6b3a764000084611c3890919063ffffffff16565b611cbe90919063ffffffff16565b9050600061173c8661172e670de0b6b3a764000073a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4873ffffffffffffffffffffffffffffffffffffffff166370a082318a6040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156116e557600080fd5b505afa1580156116f9573d6000803e3d6000fd5b505050506040513d602081101561170f57600080fd5b8101908080519060200190929190505050611c3890919063ffffffff16565b611cbe90919063ffffffff16565b905060006117688361175a620f424085611c3890919063ffffffff16565b611cbe90919063ffffffff16565b905080620f4240611788620f424088600f0b611d0890919063ffffffff16565b028161179057fe5b04935060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330886040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b15801561183857600080fd5b505af115801561184c573d6000803e3d6000fd5b505050506040513d602081101561186257600080fd5b81019080805190602001909291905050509050806118e8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f43757276652f585347442d7472616e736665722d6661696c656400000000000081525060200191505060405180910390fd5b505050505b949350505050565b600080611900610f58565b905060006305f5e1008285028161191357fe5b04905060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb87846040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b15801561199d57600080fd5b505af11580156119b1573d6000803e3d6000fd5b505050506040513d60208110156119c757600080fd5b8101908080519060200190929190505050905080611a4d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f43757276652f585347442d7472616e736665722d6661696c656400000000000081525060200191505060405180910390fd5b611a63620f424083611de690919063ffffffff16565b935050505092915050565b600080611a79610f58565b9050611aa0620f42406305f5e10083860281611a9157fe5b04611de690919063ffffffff16565b915050919050565b6000807370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330866040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b158015611b4e57600080fd5b505af1158015611b62573d6000803e3d6000fd5b505050506040513d6020811015611b7857600080fd5b8101908080519060200190929190505050905080611bfe576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f43757276652f585347442d7472616e736665722d66726f6d2d6661696c65640081525060200191505060405180910390fd5b6000611c08610f58565b9050611c2f620f42406305f5e10083870281611c2057fe5b04611de690919063ffffffff16565b92505050919050565b600080831415611c4b5760009050611cb8565b6000828402905082848281611c5c57fe5b0414611cb3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001806120d66021913960400191505060405180910390fd5b809150505b92915050565b6000611d0083836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250611e4e565b905092915050565b600080821415611d1b5760009050611dbd565b600083600f0b1215611d2c57600080fd5b600060406fffffffffffffffffffffffffffffffff841685600f0b02901c90506000608084901c85600f0b02905077ffffffffffffffffffffffffffffffffffffffffffffffff811115611d7f57600080fd5b604081901b9050817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03811115611db557600080fd5b818101925050505b92915050565b6000677fffffffffffffff821115611dda57600080fd5b604082901b9050919050565b600080821415611df557600080fd5b6000611e018484611f14565b90506f7fffffffffffffffffffffffffffffff6fffffffffffffffffffffffffffffffff16816fffffffffffffffffffffffffffffffff161115611e4457600080fd5b8091505092915050565b60008083118290611efa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015611ebf578082015181840152602081019050611ea4565b50505050905090810190601f168015611eec5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b506000838581611f0657fe5b049050809150509392505050565b600080821415611f2357600080fd5b600077ffffffffffffffffffffffffffffffffffffffffffffffff8411611f595782604085901b81611f5157fe5b0490506120ae565b600060c09050600060c086901c90506401000000008110611f8257602081901c90506020820191505b620100008110611f9a57601081901c90506010820191505b6101008110611fb157600881901c90506008820191505b60108110611fc757600481901c90506004820191505b60048110611fdd57600281901c90506002820191505b60028110611fec576001820191505b600160bf830360018703901c018260ff0387901b8161200757fe5b0492506fffffffffffffffffffffffffffffffff83111561202757600080fd5b6000608086901c8402905060006fffffffffffffffffffffffffffffffff871685029050600060c089901c9050600060408a901b90508281101561206c576001820391505b8281039050608084901b925082811015612087576001820391505b8281039050608084901c821461209957fe5b8881816120a257fe5b04870196505050505050505b6fffffffffffffffffffffffffffffffff8111156120cb57600080fd5b809150509291505056fe536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77a26469706673582212204a49f45cc3ac9aef9885916049cce4ec53d5de9bc6324f11ca1bedadea36213964736f6c63430007030033";
