/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { Orchestrator } from "../Orchestrator";

export class Orchestrator__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides & { from?: string | Promise<string> }): Promise<Orchestrator> {
    return super.deploy(overrides || {}) as Promise<Orchestrator>;
  }
  getDeployTransaction(overrides?: Overrides & { from?: string | Promise<string> }): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Orchestrator {
    return super.attach(address) as Orchestrator;
  }
  connect(signer: Signer): Orchestrator__factory {
    return super.connect(signer) as Orchestrator__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Orchestrator {
    return new Contract(address, _abi, signerOrProvider) as Orchestrator;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "numeraire",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "weight",
        type: "uint256",
      },
    ],
    name: "AssetIncluded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "derivative",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "numeraire",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "assimilator",
        type: "address",
      },
    ],
    name: "AssimilatorIncluded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "alpha",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "beta",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "delta",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "epsilon",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lambda",
        type: "uint256",
      },
    ],
    name: "ParametersSet",
    type: "event",
  },
];

const _bytecode =
  "0x6126cb610026600b82828239805160001a60731461001957fe5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361061004b5760003560e01c8063231888b714610050578063ae68cdff146100bd578063faa50b5d14610215575b600080fd5b81801561005c57600080fd5b506100bb600480360360c081101561007357600080fd5b81019080803590602001909291908035906020019092919080359060200190929190803590602001909291908035906020019092919080359060200190929190505050610273565b005b8180156100c957600080fd5b50610213600480360360e08110156100e057600080fd5b81019080803590602001909291908035906020019092919080359060200190929190803590602001909291908035906020019064010000000081111561012557600080fd5b82018360208201111561013757600080fd5b8035906020019184602083028401116401000000008311171561015957600080fd5b90919293919293908035906020019064010000000081111561017a57600080fd5b82018360208201111561018c57600080fd5b803590602001918460208302840111640100000000831117156101ae57600080fd5b9091929391929390803590602001906401000000008111156101cf57600080fd5b8201836020820111156101e157600080fd5b8035906020019184602083028401116401000000008311171561020357600080fd5b9091929391929390505050610840565b005b6102416004803603602081101561022b57600080fd5b8101908080359060200190929190505050610db6565b604051808681526020018581526020018481526020018381526020018281526020019550505050505060405180910390f35b84600010801561028a5750670de0b6b3a764000085105b6102fc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f43757276652f706172616d657465722d696e76616c69642d616c70686100000081525060200191505060405180910390fd5b848410610371576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601c8152602001807f43757276652f706172616d657465722d696e76616c69642d626574610000000081525060200191505060405180910390fd5b6706f05b59d3b200008311156103ef576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f43757276652f706172616d657465722d696e76616c69642d6d6178000000000081525060200191505060405180910390fd5b662386f26fc1000082111561046c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f43757276652f706172616d657465722d696e76616c69642d657073696c6f6e0081525060200191505060405180910390fd5b670de0b6b3a76400008111156104ea576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601e8152602001807f43757276652f706172616d657465722d696e76616c69642d6c616d626461000081525060200191505060405180910390fd5b60006104f587610ebc565b9050610515670de0b6b3a76400006001880161104590919063ffffffff16565b8760000160006101000a8154816fffffffffffffffffffffffffffffffff0219169083600f0b6fffffffffffffffffffffffffffffffff160217905550610570670de0b6b3a76400006001870161104590919063ffffffff16565b8760000160106101000a8154816fffffffffffffffffffffffffffffffff0219169083600f0b6fffffffffffffffffffffffffffffffff16021790555060126106346106086105ed8a60000160109054906101000a9004600f0b8b60000160009054906101000a9004600f0b600f0b6110ad90919063ffffffff16565b6105f76002611114565b600f0b61113790919063ffffffff16565b610623670de0b6b3a76400008861104590919063ffffffff16565b600f0b6111a290919063ffffffff16565b018760010160006101000a8154816fffffffffffffffffffffffffffffffff0219169083600f0b6fffffffffffffffffffffffffffffffff160217905550610690670de0b6b3a76400006001850161104590919063ffffffff16565b8760010160106101000a8154816fffffffffffffffffffffffffffffffff0219169083600f0b6fffffffffffffffffffffffffffffffff1602179055506106eb670de0b6b3a76400006001840161104590919063ffffffff16565b8760020160006101000a8154816fffffffffffffffffffffffffffffffff0219169083600f0b6fffffffffffffffffffffffffffffffff160217905550600061073388610ebc565b905080600f0b82600f0b12156107b1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f43757276652f706172616d65746572732d696e6372656173652d66656500000081525060200191505060405180910390fd5b7fb399767364127d5a414f09f214fa5606358052b764894b1084ce5ef067c05a978787610803670de0b6b3a76400008c60010160009054906101000a9004600f0b600f0b61122590919063ffffffff16565b8787604051808681526020018581526020018481526020018381526020018281526020019550505050505060405180910390a15050505050505050565b60005b84849050811015610c0e5760006005820290508a88888381811061086357fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff169080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550888888838181106108ed57fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff169080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508988888360020181811061097a57fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff169080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550878782600201818110610a0657fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16888883818110610a4557fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610b0b5788888883600201818110610a8d57fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff169080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b610c008c898984818110610b1b57fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff168a8a85600101818110610b4757fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff168b8b86600201818110610b7357fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff168c8c87600301818110610b9f57fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff168d8d88600401818110610bcb57fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff168c8c8a818110610bf457fe5b905060200201356112e0565b508080600101915050610843565b5060005b60058383905081610c1f57fe5b04811015610da957600060058202905088848483818110610c3c57fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff169080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610d9b8c858584818110610cc957fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff16868685600101818110610cf557fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff16878786600201818110610d2157fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff16888887600301818110610d4d57fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff16898988600401818110610d7957fe5b9050602002013573ffffffffffffffffffffffffffffffffffffffff16611a53565b508080600101915050610c12565b5050505050505050505050565b6000806000806000610ded670de0b6b3a76400008760000160009054906101000a9004600f0b600f0b61122590919063ffffffff16565b9450610e1e670de0b6b3a76400008760000160109054906101000a9004600f0b600f0b61122590919063ffffffff16565b9350610e4f670de0b6b3a76400008760010160009054906101000a9004600f0b600f0b61122590919063ffffffff16565b9250610e80670de0b6b3a76400008760010160109054906101000a9004600f0b600f0b61122590919063ffffffff16565b9150610eb1670de0b6b3a76400008760020160009054906101000a9004600f0b600f0b61122590919063ffffffff16565b905091939590929450565b6000806060600267ffffffffffffffff81118015610ed957600080fd5b50604051908082528060200260200182016040528015610f085781602001602082028036833780820191505090505b50905060005b8151811015610f94576000610f5e866004018381548110610f2b57fe5b9060005260206000200160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16611e61565b905080838381518110610f6d57fe5b6020026020010190600f0b9081600f0b815250508084019350508080600101915050610f0e565b5061103c82828660000160109054906101000a9004600f0b8760010160009054906101000a9004600f0b8860030180548060200260200160405190810160405280929190818152602001828054801561103257602002820191906000526020600020906000905b82829054906101000a9004600f0b600f0b81526020019060100190602082600f01049283019260010382029150808411610ffb5790505b5050505050611f0c565b92505050919050565b60008082141561105457600080fd5b60006110608484611f87565b90506f7fffffffffffffffffffffffffffffff6fffffffffffffffffffffffffffffffff16816fffffffffffffffffffffffffffffffff1611156110a357600080fd5b8091505092915050565b60008082600f0b84600f0b0390507fffffffffffffffffffffffffffffffff80000000000000000000000000000000600f0b811215801561110157506f7fffffffffffffffffffffffffffffff600f0b8113155b61110a57600080fd5b8091505092915050565b6000677fffffffffffffff82111561112b57600080fd5b604082901b9050919050565b600080604083600f0b85600f0b02901d90507fffffffffffffffffffffffffffffffff80000000000000000000000000000000600f0b811215801561118f57506f7fffffffffffffffffffffffffffffff600f0b8113155b61119857600080fd5b8091505092915050565b60008082600f0b14156111b457600080fd5b600082600f0b604085600f0b901b816111c957fe5b0590507fffffffffffffffffffffffffffffffff80000000000000000000000000000000600f0b811215801561121257506f7fffffffffffffffffffffffffffffff600f0b8113155b61121b57600080fd5b8091505092915050565b60008082141561123857600090506112da565b600083600f0b121561124957600080fd5b600060406fffffffffffffffffffffffffffffffff841685600f0b02901c90506000608084901c85600f0b02905077ffffffffffffffffffffffffffffffffffffffffffffffff81111561129c57600080fd5b604081901b9050817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038111156112d257600080fd5b818101925050505b92915050565b600073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff161415611366576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602781526020018061259b6027913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614156113ec576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260338152602001806126326033913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415611472576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602581526020018061260d6025913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156114f8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260318152602001806126656031913960400191505060405180910390fd5b670de0b6b3a76400008110611558576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806125eb6022913960400191505060405180910390fd5b8373ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff16146115b7576115b686837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff612148565b5b60008760050160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050858160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555087600401805490508160000160146101000a81548160ff021916908360ff16021790555060008860050160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209050848160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555088600401805490508160000160146101000a81548160ff021916908360ff160217905550600061175c611730670de0b6b3a7640000600161104590919063ffffffff16565b61174b670de0b6b3a76400008761104590919063ffffffff16565b600f0b61232490919063ffffffff16565b9050896003018190806001815401808255809150506001900390600052602060002090600291828204019190066010029091909190916101000a8154816fffffffffffffffffffffffffffffffff0219169083600f0b6fffffffffffffffffffffffffffffffff1602179055508960040183908060018154018082558091505060019003906000526020600020016000909190919091506000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000820160149054906101000a900460ff168160000160146101000a81548160ff021916908360ff16021790555050508673ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff167f69745294f8c4916d2a4ca68ea4e3be1d5990927ba68481e69368deb3c4395d02866040518082815260200191505060405180910390a38673ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff167f4b18271a7872ab0f9e58e9ca39180e3c710490f802d663f20ae751a8e6b29bc18b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a48573ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff1614611a47578673ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff167f4b18271a7872ab0f9e58e9ca39180e3c710490f802d663f20ae751a8e6b29bc189604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a45b50505050505050505050565b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff161415611ad9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260298152602001806125c26029913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415611b5f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260288152602001806125736028913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611be5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260288152602001806125736028913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611c6b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602a815260200180612549602a913960400191505060405180910390fd5b611c9684827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff612148565b60008660050160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020905060405180604001604052808473ffffffffffffffffffffffffffffffffffffffff1681526020018260000160149054906101000a900460ff1660ff168152508760050160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a81548160ff021916908360ff1602179055509050508373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff167f4b18271a7872ab0f9e58e9ca39180e3c710490f802d663f20ae751a8e6b29bc186604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a450505050505050565b60008173ffffffffffffffffffffffffffffffffffffffff1663ac969a73306040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b158015611eca57600080fd5b505afa158015611ede573d6000803e3d6000fd5b505050506040513d6020811015611ef457600080fd5b81019080805190602001909291905050509050919050565b6000808551905060005b81811015611f7c576000611f49858381518110611f2f57fe5b60200260200101518a600f0b61238b90919063ffffffff16565b9050611f6a888381518110611f5a57fe5b60200260200101518289896123a7565b84019350508080600101915050611f16565b505095945050505050565b600080821415611f9657600080fd5b600077ffffffffffffffffffffffffffffffffffffffffffffffff8411611fcc5782604085901b81611fc457fe5b049050612121565b600060c09050600060c086901c90506401000000008110611ff557602081901c90506020820191505b62010000811061200d57601081901c90506010820191505b610100811061202457600881901c90506008820191505b6010811061203a57600481901c90506004820191505b6004811061205057600281901c90506002820191505b6002811061205f576001820191505b600160bf830360018703901c018260ff0387901b8161207a57fe5b0492506fffffffffffffffffffffffffffffffff83111561209a57600080fd5b6000608086901c8402905060006fffffffffffffffffffffffffffffffff871685029050600060c089901c9050600060408a901b9050828110156120df576001820391505b8281039050608084901b9250828110156120fa576001820391505b8281039050608084901c821461210c57fe5b88818161211557fe5b04870196505050505050505b6fffffffffffffffffffffffffffffffff81111561213e57600080fd5b8091505092915050565b60008373ffffffffffffffffffffffffffffffffffffffff168383604051602401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506040516020818303038152906040527f095ea7b3000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040518082805190602001908083835b60208310612240578051825260208201915060208101905060208303925061221d565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146122a2576040519150601f19603f3d011682016040523d82523d6000602084013e6122a7565b606091505b505090508061231e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c656481525060200191505060405180910390fd5b50505050565b60008082600f0b84600f0b0190507fffffffffffffffffffffffffffffffff80000000000000000000000000000000600f0b811215801561237857506f7fffffffffffffffffffffffffffffff600f0b8113155b61238157600080fd5b8091505092915050565b600080604083600f0b85600f0b02901d90508091505092915050565b600083600f0b85600f0b121561246c5760006123da84680100000000000000000386600f0b61238b90919063ffffffff16565b905080600f0b86600f0b121561246157600086820390506124078682600f0b61252590919063ffffffff16565b925061241f8484600f0b61238b90919063ffffffff16565b9250674000000000000000600f0b83600f0b13156124435767400000000000000092505b6124598184600f0b61238b90919063ffffffff16565b925050612466565b600091505b5061251d565b600061248f84680100000000000000000186600f0b61238b90919063ffffffff16565b905080600f0b86600f0b131561251657600081870390506124bc8682600f0b61252590919063ffffffff16565b92506124d48484600f0b61238b90919063ffffffff16565b9250674000000000000000600f0b83600f0b13156124f85767400000000000000092505b61250e8184600f0b61238b90919063ffffffff16565b92505061251b565b600091505b505b949350505050565b60008082600f0b604085600f0b901b8161253b57fe5b059050809150509291505056fe43757276652f617373696d696c61746f722d63616e6e6f742d62652d7a65726f74682d6164647265737343757276652f6e756d6572616972652d63616e6e6f742d62652d7a65726f74682d6164647265737343757276652f6e756d6572616972652d63616e6e6f742d62652d7a65726f74682d61647265737343757276652f646572697661746976652d63616e6e6f742d62652d7a65726f74682d6164647265737343757276652f7765696768742d6d7573742d62652d6c6573732d7468616e2d6f6e6543757276652f726573657276652d63616e6e6f742d62652d7a65726f74682d61647265737343757276652f6e756d6572616972652d617373696d696c61746f722d63616e6e6f742d62652d7a65726f74682d61647265737343757276652f726573657276652d617373696d696c61746f722d63616e6e6f742d62652d7a65726f74682d616472657373a2646970667358221220038262f7ebfbfbe1f2aac4a2088d81a9e256ed0f83f4e20e9c122e089088873664736f6c63430007030033";
