/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { Assimilators } from "../Assimilators";

export class Assimilators__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides & { from?: string | Promise<string> }): Promise<Assimilators> {
    return super.deploy(overrides || {}) as Promise<Assimilators>;
  }
  getDeployTransaction(overrides?: Overrides & { from?: string | Promise<string> }): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Assimilators {
    return super.attach(address) as Assimilators;
  }
  connect(signer: Signer): Assimilators__factory {
    return super.connect(signer) as Assimilators__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Assimilators {
    return new Contract(address, _abi, signerOrProvider) as Assimilators;
  }
}

const _abi = [
  {
    inputs: [],
    name: "iAsmltr",
    outputs: [
      {
        internalType: "contract IAssimilator",
        name: "",
        type: "IAssimilator",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a5610024600b82828239805160001a607314601757fe5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c806375bb1536146038575b600080fd5b603e606a565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60008156fea264697066735822122047f1af167d85de799288f9eae96ddd03338371f3383c1ff061bee22e51f0435464736f6c63430007030033";
