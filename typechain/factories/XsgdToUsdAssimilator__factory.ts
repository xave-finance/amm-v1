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

  deploy(overrides?: Overrides & { from?: string | Promise<string> }): Promise<XsgdToUsdAssimilator> {
    return super.deploy(overrides || {}) as Promise<XsgdToUsdAssimilator>;
  }
  getDeployTransaction(overrides?: Overrides & { from?: string | Promise<string> }): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): XsgdToUsdAssimilator {
    return super.attach(address) as XsgdToUsdAssimilator;
  }
  connect(signer: Signer): XsgdToUsdAssimilator__factory {
    return super.connect(signer) as XsgdToUsdAssimilator__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): XsgdToUsdAssimilator {
    return new Contract(address, _abi, signerOrProvider) as XsgdToUsdAssimilator;
  }
}

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506119a3806100206000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80636fc39052116100715780636fc39052146102855780637f328ecc146102ea578063ac969a7314610339578063f09a3fc314610394578063f5e6c0ca146103f9578063fa00102a1461043e576100a9565b80630271c3c8146100ae57806305cf7bb4146100f35780631e9b2cba14610162578063523bf257146101d15780636b677a8f14610240575b600080fd5b6100dd600480360360208110156100c457600080fd5b810190808035600f0b9060200190929190505050610483565b6040518082815260200191505060405180910390f35b6101496004803603606081101561010957600080fd5b810190808035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610616565b6040518082600f0b815260200191505060405180910390f35b6101ae6004803603604081101561017857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610864565b6040518083600f0b815260200182600f0b81526020019250505060405180910390f35b61021d600480360360408110156101e757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610975565b6040518083600f0b815260200182600f0b81526020019250505060405180910390f35b61026f6004803603602081101561025657600080fd5b810190808035600f0b9060200190929190505050610bc4565b6040518082815260200191505060405180910390f35b6102d46004803603604081101561029b57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035600f0b9060200190929190505050610c01565b6040518082815260200191505060405180910390f35b6103166004803603602081101561030057600080fd5b8101908080359060200190929190505050610d77565b6040518083600f0b815260200182600f0b81526020019250505060405180910390f35b61037b6004803603602081101561034f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610fdc565b6040518082600f0b815260200191505060405180910390f35b6103e0600480360360408110156103aa57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506110d0565b6040518082600f0b815260200191505060405180910390f35b6104256004803603602081101561040f57600080fd5b8101908080359060200190929190505050611249565b6040518082600f0b815260200191505060405180910390f35b61046a6004803603602081101561045457600080fd5b8101908080359060200190929190505050611283565b6040518082600f0b815260200191505060405180910390f35b60008061048e611413565b9050806305f5e1006104af620f424086600f0b6114af90919063ffffffff16565b02816104b757fe5b04915060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330866040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b15801561055f57600080fd5b505af1158015610573573d6000803e3d6000fd5b505050506040513d602081101561058957600080fd5b810190808051906020019092919050505090508061060f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f43757276652f455552532d7472616e736665722d66726f6d2d6661696c65640081525060200191505060405180910390fd5b5050919050565b6000807370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166370a08231846040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561069457600080fd5b505afa1580156106a8573d6000803e3d6000fd5b505050506040513d60208110156106be57600080fd5b81019080805190602001909291905050509050600081116106eb576106e3600061156a565b91505061085d565b60006107cf856107c1670de0b6b3a764000073a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4873ffffffffffffffffffffffffffffffffffffffff166370a08231896040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561077857600080fd5b505afa15801561078c573d6000803e3d6000fd5b505050506040513d60208110156107a257600080fd5b810190808051906020019092919050505061158d90919063ffffffff16565b61161390919063ffffffff16565b9050600061082c610803886107f5670de0b6b3a76400008761158d90919063ffffffff16565b61161390919063ffffffff16565b61081e670de0b6b3a76400008561158d90919063ffffffff16565b61161390919063ffffffff16565b9050610857670de0b6b3a7640000620f42408386028161084857fe5b0461165d90919063ffffffff16565b93505050505b9392505050565b6000806000610871611413565b9050610898620f42406305f5e1008387028161088957fe5b0461165d90919063ffffffff16565b925060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166370a08231876040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561091757600080fd5b505afa15801561092b573d6000803e3d6000fd5b505050506040513d602081101561094157600080fd5b8101908080519060200190929190505050905061096a620f42408261165d90919063ffffffff16565b925050509250929050565b6000806000610982611413565b905060006305f5e1008286028161099557fe5b04905060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb88846040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b158015610a1f57600080fd5b505af1158015610a33573d6000803e3d6000fd5b505050506040513d6020811015610a4957600080fd5b8101908080519060200190929190505050905080610acf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f43757276652f455552532d7472616e736665722d6661696c656400000000000081525060200191505060405180910390fd5b60007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610b4c57600080fd5b505afa158015610b60573d6000803e3d6000fd5b505050506040513d6020811015610b7657600080fd5b81019080805190602001909291905050509050610b9f620f42408461165d90919063ffffffff16565b9550610bb7620f42408261165d90919063ffffffff16565b9450505050509250929050565b600080610bcf611413565b9050806305f5e100610bf0620f424086600f0b6114af90919063ffffffff16565b0281610bf857fe5b04915050919050565b600080610c0c611413565b9050806305f5e100610c2d620f424086600f0b6114af90919063ffffffff16565b0281610c3557fe5b04915060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb86856040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b158015610cbf57600080fd5b505af1158015610cd3573d6000803e3d6000fd5b505050506040513d6020811015610ce957600080fd5b8101908080519060200190929190505050905080610d6f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f43757276652f455552532d7472616e736665722d6661696c656400000000000081525060200191505060405180910390fd5b505092915050565b60008060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330876040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b158015610e1f57600080fd5b505af1158015610e33573d6000803e3d6000fd5b505050506040513d6020811015610e4957600080fd5b8101908080519060200190929190505050905080610ecf576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f43757276652f455552532d7472616e736665722d66726f6d2d6661696c65640081525060200191505060405180910390fd5b60007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015610f4c57600080fd5b505afa158015610f60573d6000803e3d6000fd5b505050506040513d6020811015610f7657600080fd5b810190808051906020019092919050505090506000610f93611413565b9050610fab620f42408361165d90919063ffffffff16565b9350610fd2620f42406305f5e10083890281610fc357fe5b0461165d90919063ffffffff16565b9450505050915091565b6000807370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166370a08231846040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561105a57600080fd5b505afa15801561106e573d6000803e3d6000fd5b505050506040513d602081101561108457600080fd5b81019080805190602001909291905050509050600081116110b1576110a9600061156a565b9150506110cb565b6110c7620f42408261165d90919063ffffffff16565b9150505b919050565b6000806110db611413565b905060006305f5e100828502816110ee57fe5b04905060007370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb87846040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b15801561117857600080fd5b505af115801561118c573d6000803e3d6000fd5b505050506040513d60208110156111a257600080fd5b8101908080519060200190929190505050905080611228576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f43757276652f455552532d7472616e736665722d6661696c656400000000000081525060200191505060405180910390fd5b61123e620f42408361165d90919063ffffffff16565b935050505092915050565b600080611254611413565b905061127b620f42406305f5e1008386028161126c57fe5b0461165d90919063ffffffff16565b915050919050565b6000807370e8de73ce538da2beed35d14187f6959a8eca9673ffffffffffffffffffffffffffffffffffffffff166323b872dd3330866040518463ffffffff1660e01b8152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b15801561132957600080fd5b505af115801561133d573d6000803e3d6000fd5b505050506040513d602081101561135357600080fd5b81019080805190602001909291905050509050806113d9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f43757276652f787367642d7472616e736665722d66726f6d2d6661696c65640081525060200191505060405180910390fd5b60006113e3611413565b905061140a620f42406305f5e100838702816113fb57fe5b0461165d90919063ffffffff16565b92505050919050565b600073e25277ff4bbf9081c75ab0eb13b4a13a721f3e1373ffffffffffffffffffffffffffffffffffffffff166350d25bcd6040518163ffffffff1660e01b815260040160206040518083038186803b15801561146f57600080fd5b505afa158015611483573d6000803e3d6000fd5b505050506040513d602081101561149957600080fd5b8101908080519060200190929190505050905090565b6000808214156114c25760009050611564565b600083600f0b12156114d357600080fd5b600060406fffffffffffffffffffffffffffffffff841685600f0b02901c90506000608084901c85600f0b02905077ffffffffffffffffffffffffffffffffffffffffffffffff81111561152657600080fd5b604081901b9050817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0381111561155c57600080fd5b818101925050505b92915050565b6000677fffffffffffffff82111561158157600080fd5b604082901b9050919050565b6000808314156115a0576000905061160d565b60008284029050828482816115b157fe5b0414611608576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602181526020018061194d6021913960400191505060405180910390fd5b809150505b92915050565b600061165583836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f0000000000008152506116c5565b905092915050565b60008082141561166c57600080fd5b6000611678848461178b565b90506f7fffffffffffffffffffffffffffffff6fffffffffffffffffffffffffffffffff16816fffffffffffffffffffffffffffffffff1611156116bb57600080fd5b8091505092915050565b60008083118290611771576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b8381101561173657808201518184015260208101905061171b565b50505050905090810190601f1680156117635780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b50600083858161177d57fe5b049050809150509392505050565b60008082141561179a57600080fd5b600077ffffffffffffffffffffffffffffffffffffffffffffffff84116117d05782604085901b816117c857fe5b049050611925565b600060c09050600060c086901c905064010000000081106117f957602081901c90506020820191505b62010000811061181157601081901c90506010820191505b610100811061182857600881901c90506008820191505b6010811061183e57600481901c90506004820191505b6004811061185457600281901c90506002820191505b60028110611863576001820191505b600160bf830360018703901c018260ff0387901b8161187e57fe5b0492506fffffffffffffffffffffffffffffffff83111561189e57600080fd5b6000608086901c8402905060006fffffffffffffffffffffffffffffffff871685029050600060c089901c9050600060408a901b9050828110156118e3576001820391505b8281039050608084901b9250828110156118fe576001820391505b8281039050608084901c821461191057fe5b88818161191957fe5b04870196505050505050505b6fffffffffffffffffffffffffffffffff81111561194257600080fd5b809150509291505056fe536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77a26469706673582212206a40fda70af3d8173f7feea7f04b02d01b6a9bf371d0f60bb646387ed3e92bc264736f6c63430007030033";
