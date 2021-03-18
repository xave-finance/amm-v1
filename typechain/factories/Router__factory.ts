/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { Router } from "../Router";

export class Router__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(_factory: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<Router> {
    return super.deploy(_factory, overrides || {}) as Promise<Router>;
  }
  getDeployTransaction(
    _factory: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(_factory, overrides || {});
  }
  attach(address: string): Router {
    return super.attach(address) as Router;
  }
  connect(signer: Signer): Router__factory {
    return super.connect(signer) as Router__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Router {
    return new Contract(address, _abi, signerOrProvider) as Router;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_factory",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_quoteCurrency",
        type: "address",
      },
      {
        internalType: "address",
        name: "_origin",
        type: "address",
      },
      {
        internalType: "address",
        name: "_target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_originAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minTargetAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "originSwap",
    outputs: [
      {
        internalType: "uint256",
        name: "targetAmount_",
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
        name: "_quoteCurrency",
        type: "address",
      },
      {
        internalType: "address",
        name: "_origin",
        type: "address",
      },
      {
        internalType: "address",
        name: "_target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_originAmount",
        type: "uint256",
      },
    ],
    name: "viewOriginSwap",
    outputs: [
      {
        internalType: "uint256",
        name: "targetAmount_",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_quoteCurrency",
        type: "address",
      },
      {
        internalType: "address",
        name: "_origin",
        type: "address",
      },
      {
        internalType: "address",
        name: "_target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_targetAmount",
        type: "uint256",
      },
    ],
    name: "viewTargetSwap",
    outputs: [
      {
        internalType: "uint256",
        name: "originAmount_",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161238f38038061238f8339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506122fb806100946000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806312801ad6146100515780639d73b325146100f3578063c45a0155146101a9578063d1df8ccd146101dd575b600080fd5b6100dd6004803603608081101561006757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061027f565b6040518082815260200191505060405180910390f35b610193600480360360c081101561010957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291908035906020019092919080359060200190929190505050610a61565b6040518082815260200191505060405180910390f35b6101b1611382565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610269600480360360808110156101f357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506113a6565b6040518082815260200191505060405180910390f35b60008060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366903e808686604051602001808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b15801561034d57600080fd5b505afa158015610361573d6000803e3d6000fd5b505050506040513d602081101561037757600080fd5b810190808051906020019092919050505090508573ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614156104c75760008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366903e808587604051602001808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b15801561048957600080fd5b505afa15801561049d573d6000803e3d6000fd5b505050506040513d60208110156104b357600080fd5b810190808051906020019092919050505090505b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146105cb578073ffffffffffffffffffffffffffffffffffffffff1663838e6a228686866040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060206040518083038186803b15801561058857600080fd5b505afa15801561059c573d6000803e3d6000fd5b505050506040513d60208110156105b257600080fd5b8101908080519060200190929190505050915050610a59565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366903e808688604051602001808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b15801561069657600080fd5b505afa1580156106aa573d6000803e3d6000fd5b505050506040513d60208110156106c057600080fd5b8101908080519060200190929190505050905060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366903e808689604051602001808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b1580156107a157600080fd5b505afa1580156107b5573d6000803e3d6000fd5b505050506040513d60208110156107cb57600080fd5b81019080805190602001909291905050509050600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141580156108485750600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b156109eb5760008273ffffffffffffffffffffffffffffffffffffffff1663838e6a22888a886040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060206040518083038186803b1580156108dc57600080fd5b505afa1580156108f0573d6000803e3d6000fd5b505050506040513d602081101561090657600080fd5b810190808051906020019092919050505090508173ffffffffffffffffffffffffffffffffffffffff1663838e6a228988846040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060206040518083038186803b1580156109a657600080fd5b505afa1580156109ba573d6000803e3d6000fd5b505050506040513d60208110156109d057600080fd5b81019080805190602001909291905050509350505050610a59565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f526f757465722f4e6f2d7061746800000000000000000000000000000000000081525060200191505060405180910390fd5b949350505050565b6000610a903330868973ffffffffffffffffffffffffffffffffffffffff16611b88909392919063ffffffff16565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366903e808888604051602001808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b158015610b5e57600080fd5b505afa158015610b72573d6000803e3d6000fd5b505050506040513d6020811015610b8857600080fd5b810190808051906020019092919050505090508773ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff161415610cd85760008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366903e808789604051602001808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b158015610c9a57600080fd5b505afa158015610cae573d6000803e3d6000fd5b505050506040513d6020811015610cc457600080fd5b810190808051906020019092919050505090505b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610e4457610d3781868973ffffffffffffffffffffffffffffffffffffffff16611c499092919063ffffffff16565b8073ffffffffffffffffffffffffffffffffffffffff16630b2583c888888888886040518663ffffffff1660e01b8152600401808673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff16815260200184815260200183815260200182815260200195505050505050602060405180830381600087803b158015610dd657600080fd5b505af1158015610dea573d6000803e3d6000fd5b505050506040513d6020811015610e0057600080fd5b81019080805190602001909291905050509150610e3e33838873ffffffffffffffffffffffffffffffffffffffff16611e0e9092919063ffffffff16565b50611378565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366903e80888a604051602001808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b158015610f0f57600080fd5b505afa158015610f23573d6000803e3d6000fd5b505050506040513d6020811015610f3957600080fd5b8101908080519060200190929190505050905060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366903e80888b604051602001808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b15801561101a57600080fd5b505afa15801561102e573d6000803e3d6000fd5b505050506040513d602081101561104457600080fd5b81019080805190602001909291905050509050600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141580156110c15750600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b1561130a576110f182878a73ffffffffffffffffffffffffffffffffffffffff16611c499092919063ffffffff16565b60008273ffffffffffffffffffffffffffffffffffffffff16630b2583c88a8c8a60008a6040518663ffffffff1660e01b8152600401808673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff16815260200184815260200183815260200182815260200195505050505050602060405180830381600087803b15801561119357600080fd5b505af11580156111a7573d6000803e3d6000fd5b505050506040513d60208110156111bd57600080fd5b810190808051906020019092919050505090506111fb82828c73ffffffffffffffffffffffffffffffffffffffff16611c499092919063ffffffff16565b8173ffffffffffffffffffffffffffffffffffffffff16630b2583c88b8a848a8a6040518663ffffffff1660e01b8152600401808673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff16815260200184815260200183815260200182815260200195505050505050602060405180830381600087803b15801561129a57600080fd5b505af11580156112ae573d6000803e3d6000fd5b505050506040513d60208110156112c457600080fd5b8101908080519060200190929190505050935061130233858a73ffffffffffffffffffffffffffffffffffffffff16611e0e9092919063ffffffff16565b505050611378565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f526f757465722f4e6f2d7061746800000000000000000000000000000000000081525060200191505060405180910390fd5b9695505050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366903e808686604051602001808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b15801561147457600080fd5b505afa158015611488573d6000803e3d6000fd5b505050506040513d602081101561149e57600080fd5b810190808051906020019092919050505090508573ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614156115ee5760008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366903e808587604051602001808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b1580156115b057600080fd5b505afa1580156115c4573d6000803e3d6000fd5b505050506040513d60208110156115da57600080fd5b810190808051906020019092919050505090505b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146116f2578073ffffffffffffffffffffffffffffffffffffffff1663525d0da78686866040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060206040518083038186803b1580156116af57600080fd5b505afa1580156116c3573d6000803e3d6000fd5b505050506040513d60208110156116d957600080fd5b8101908080519060200190929190505050915050611b80565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366903e808588604051602001808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b1580156117bd57600080fd5b505afa1580156117d1573d6000803e3d6000fd5b505050506040513d60208110156117e757600080fd5b8101908080519060200190929190505050905060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166366903e808789604051602001808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b1580156118c857600080fd5b505afa1580156118dc573d6000803e3d6000fd5b505050506040513d60208110156118f257600080fd5b81019080805190602001909291905050509050600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415801561196f5750600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b15611b125760008273ffffffffffffffffffffffffffffffffffffffff1663525d0da78988886040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060206040518083038186803b158015611a0357600080fd5b505afa158015611a17573d6000803e3d6000fd5b505050506040513d6020811015611a2d57600080fd5b810190808051906020019092919050505090508173ffffffffffffffffffffffffffffffffffffffff1663525d0da7888a846040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060206040518083038186803b158015611acd57600080fd5b505afa158015611ae1573d6000803e3d6000fd5b505050506040513d6020811015611af757600080fd5b81019080805190602001909291905050509350505050611b80565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f526f757465722f4e6f2d7061746800000000000000000000000000000000000081525060200191505060405180910390fd5b949350505050565b611c43846323b872dd60e01b858585604051602401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611eb0565b50505050565b6000811480611d17575060008373ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e30856040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060206040518083038186803b158015611cda57600080fd5b505afa158015611cee573d6000803e3d6000fd5b505050506040513d6020811015611d0457600080fd5b8101908080519060200190929190505050145b611d6c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260368152602001806122906036913960400191505060405180910390fd5b611e098363095ea7b360e01b8484604051602401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611eb0565b505050565b611eab8363a9059cbb60e01b8484604051602401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611eb0565b505050565b6060611f12826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff16611f9f9092919063ffffffff16565b9050600081511115611f9a57808060200190516020811015611f3357600080fd5b8101908080519060200190929190505050611f99576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602a815260200180612266602a913960400191505060405180910390fd5b5b505050565b6060611fae8484600085611fb7565b90509392505050565b606082471015612012576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260268152602001806122406026913960400191505060405180910390fd5b61201b85612160565b61208d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000081525060200191505060405180910390fd5b600060608673ffffffffffffffffffffffffffffffffffffffff1685876040518082805190602001908083835b602083106120dd57805182526020820191506020810190506020830392506120ba565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d806000811461213f576040519150601f19603f3d011682016040523d82523d6000602084013e612144565b606091505b5091509150612154828286612173565b92505050949350505050565b600080823b905060008111915050919050565b6060831561218357829050612238565b6000835111156121965782518084602001fd5b816040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b838110156121fd5780820151818401526020810190506121e2565b50505050905090810190601f16801561222a5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b939250505056fe416464726573733a20696e73756666696369656e742062616c616e636520666f722063616c6c5361666545524332303a204552433230206f7065726174696f6e20646964206e6f7420737563636565645361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f20746f206e6f6e2d7a65726f20616c6c6f77616e6365a2646970667358221220b3491209155a6efb337d773d2f62b350eb51125acacdda13c91a036f031334aa64736f6c63430007030033";
