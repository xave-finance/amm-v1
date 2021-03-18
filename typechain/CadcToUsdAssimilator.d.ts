/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface CadcToUsdAssimilatorInterface extends ethers.utils.Interface {
  functions: {
    "intakeNumeraire(int128)": FunctionFragment;
    "intakeRaw(uint256)": FunctionFragment;
    "intakeRawAndGetBalance(uint256)": FunctionFragment;
    "outputNumeraire(address,int128)": FunctionFragment;
    "outputRaw(address,uint256)": FunctionFragment;
    "outputRawAndGetBalance(address,uint256)": FunctionFragment;
    "viewNumeraireAmount(uint256)": FunctionFragment;
    "viewNumeraireAmountAndBalance(address,uint256)": FunctionFragment;
    "viewNumeraireBalance(address)": FunctionFragment;
    "viewNumeraireBalanceLPRatio(uint256,uint256,address)": FunctionFragment;
    "viewRawAmount(int128)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "intakeNumeraire", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "intakeRaw", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "intakeRawAndGetBalance", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "outputNumeraire", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "outputRaw", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "outputRawAndGetBalance", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "viewNumeraireAmount", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "viewNumeraireAmountAndBalance", values: [string, BigNumberish]): string;
  encodeFunctionData(functionFragment: "viewNumeraireBalance", values: [string]): string;
  encodeFunctionData(
    functionFragment: "viewNumeraireBalanceLPRatio",
    values: [BigNumberish, BigNumberish, string],
  ): string;
  encodeFunctionData(functionFragment: "viewRawAmount", values: [BigNumberish]): string;

  decodeFunctionResult(functionFragment: "intakeNumeraire", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "intakeRaw", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "intakeRawAndGetBalance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "outputNumeraire", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "outputRaw", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "outputRawAndGetBalance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "viewNumeraireAmount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "viewNumeraireAmountAndBalance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "viewNumeraireBalance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "viewNumeraireBalanceLPRatio", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "viewRawAmount", data: BytesLike): Result;

  events: {};
}

export class CadcToUsdAssimilator extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>,
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: CadcToUsdAssimilatorInterface;

  functions: {
    intakeNumeraire(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    "intakeNumeraire(int128)"(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    intakeRaw(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    "intakeRaw(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    intakeRawAndGetBalance(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    "intakeRawAndGetBalance(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    outputNumeraire(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    "outputNumeraire(address,int128)"(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    outputRaw(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    "outputRaw(address,uint256)"(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    outputRawAndGetBalance(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    "outputRawAndGetBalance(address,uint256)"(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    viewNumeraireAmount(
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { amount_: BigNumber }>;

    "viewNumeraireAmount(uint256)"(
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { amount_: BigNumber }>;

    viewNumeraireAmountAndBalance(
      _addr: string,
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount_: BigNumber; balance_: BigNumber }>;

    "viewNumeraireAmountAndBalance(address,uint256)"(
      _addr: string,
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount_: BigNumber; balance_: BigNumber }>;

    viewNumeraireBalance(_addr: string, overrides?: CallOverrides): Promise<[BigNumber] & { balance_: BigNumber }>;

    "viewNumeraireBalance(address)"(
      _addr: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { balance_: BigNumber }>;

    viewNumeraireBalanceLPRatio(
      _baseWeight: BigNumberish,
      _quoteWeight: BigNumberish,
      _addr: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { balance_: BigNumber }>;

    "viewNumeraireBalanceLPRatio(uint256,uint256,address)"(
      _baseWeight: BigNumberish,
      _quoteWeight: BigNumberish,
      _addr: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { balance_: BigNumber }>;

    viewRawAmount(_amount: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber] & { amount_: BigNumber }>;

    "viewRawAmount(int128)"(
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { amount_: BigNumber }>;
  };

  intakeNumeraire(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  "intakeNumeraire(int128)"(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  intakeRaw(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  "intakeRaw(uint256)"(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  intakeRawAndGetBalance(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  "intakeRawAndGetBalance(uint256)"(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  outputNumeraire(
    _dst: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  "outputNumeraire(address,int128)"(
    _dst: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  outputRaw(
    _dst: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  "outputRaw(address,uint256)"(
    _dst: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  outputRawAndGetBalance(
    _dst: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  "outputRawAndGetBalance(address,uint256)"(
    _dst: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  viewNumeraireAmount(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  "viewNumeraireAmount(uint256)"(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  viewNumeraireAmountAndBalance(
    _addr: string,
    _amount: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { amount_: BigNumber; balance_: BigNumber }>;

  "viewNumeraireAmountAndBalance(address,uint256)"(
    _addr: string,
    _amount: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber] & { amount_: BigNumber; balance_: BigNumber }>;

  viewNumeraireBalance(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;

  "viewNumeraireBalance(address)"(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;

  viewNumeraireBalanceLPRatio(
    _baseWeight: BigNumberish,
    _quoteWeight: BigNumberish,
    _addr: string,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  "viewNumeraireBalanceLPRatio(uint256,uint256,address)"(
    _baseWeight: BigNumberish,
    _quoteWeight: BigNumberish,
    _addr: string,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  viewRawAmount(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  "viewRawAmount(int128)"(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    intakeNumeraire(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "intakeNumeraire(int128)"(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    intakeRaw(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "intakeRaw(uint256)"(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    intakeRawAndGetBalance(
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount_: BigNumber; balance_: BigNumber }>;

    "intakeRawAndGetBalance(uint256)"(
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount_: BigNumber; balance_: BigNumber }>;

    outputNumeraire(_dst: string, _amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "outputNumeraire(address,int128)"(
      _dst: string,
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    outputRaw(_dst: string, _amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "outputRaw(address,uint256)"(_dst: string, _amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    outputRawAndGetBalance(
      _dst: string,
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount_: BigNumber; balance_: BigNumber }>;

    "outputRawAndGetBalance(address,uint256)"(
      _dst: string,
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount_: BigNumber; balance_: BigNumber }>;

    viewNumeraireAmount(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "viewNumeraireAmount(uint256)"(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    viewNumeraireAmountAndBalance(
      _addr: string,
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount_: BigNumber; balance_: BigNumber }>;

    "viewNumeraireAmountAndBalance(address,uint256)"(
      _addr: string,
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber] & { amount_: BigNumber; balance_: BigNumber }>;

    viewNumeraireBalance(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    "viewNumeraireBalance(address)"(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    viewNumeraireBalanceLPRatio(
      _baseWeight: BigNumberish,
      _quoteWeight: BigNumberish,
      _addr: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "viewNumeraireBalanceLPRatio(uint256,uint256,address)"(
      _baseWeight: BigNumberish,
      _quoteWeight: BigNumberish,
      _addr: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    viewRawAmount(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "viewRawAmount(int128)"(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    intakeNumeraire(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    "intakeNumeraire(int128)"(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    intakeRaw(_amount: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>;

    "intakeRaw(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    intakeRawAndGetBalance(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    "intakeRawAndGetBalance(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    outputNumeraire(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    "outputNumeraire(address,int128)"(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    outputRaw(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    "outputRaw(address,uint256)"(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    outputRawAndGetBalance(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    "outputRawAndGetBalance(address,uint256)"(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    viewNumeraireAmount(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "viewNumeraireAmount(uint256)"(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    viewNumeraireAmountAndBalance(_addr: string, _amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "viewNumeraireAmountAndBalance(address,uint256)"(
      _addr: string,
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    viewNumeraireBalance(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    "viewNumeraireBalance(address)"(_addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    viewNumeraireBalanceLPRatio(
      _baseWeight: BigNumberish,
      _quoteWeight: BigNumberish,
      _addr: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    "viewNumeraireBalanceLPRatio(uint256,uint256,address)"(
      _baseWeight: BigNumberish,
      _quoteWeight: BigNumberish,
      _addr: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    viewRawAmount(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "viewRawAmount(int128)"(_amount: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    intakeNumeraire(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    "intakeNumeraire(int128)"(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    intakeRaw(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    "intakeRaw(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    intakeRawAndGetBalance(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    "intakeRawAndGetBalance(uint256)"(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    outputNumeraire(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    "outputNumeraire(address,int128)"(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    outputRaw(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    "outputRaw(address,uint256)"(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    outputRawAndGetBalance(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    "outputRawAndGetBalance(address,uint256)"(
      _dst: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    viewNumeraireAmount(_amount: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "viewNumeraireAmount(uint256)"(_amount: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    viewNumeraireAmountAndBalance(
      _addr: string,
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    "viewNumeraireAmountAndBalance(address,uint256)"(
      _addr: string,
      _amount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    viewNumeraireBalance(_addr: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "viewNumeraireBalance(address)"(_addr: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    viewNumeraireBalanceLPRatio(
      _baseWeight: BigNumberish,
      _quoteWeight: BigNumberish,
      _addr: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    "viewNumeraireBalanceLPRatio(uint256,uint256,address)"(
      _baseWeight: BigNumberish,
      _quoteWeight: BigNumberish,
      _addr: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    viewRawAmount(_amount: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "viewRawAmount(int128)"(_amount: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
