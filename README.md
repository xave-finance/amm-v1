# DFX Protocol V0.5

A decentralized foreign exchange protocol optimized for stablecoins.

[![Discord](https://img.shields.io/discord/786747729376051211.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](http://discord.dfx.finance/)
[![Twitter Follow](https://img.shields.io/twitter/follow/DFXFinance.svg?label=DFXFinance&style=social)](https://twitter.com/DFXFinance)

## Overview

DFX v0.5 is a fork of [shellprotocol@48dac1c](https://github.com/cowri/shell-solidity-v1/tree/48dac1c1a18e2da292b0468577b9e6cbdb3786a4), an AMM for baskets of like-valued pairs. An audit of that protocol was previously done by [Consensys Diligence](https://consensys.net/diligence/audits/2020/06/shell-protocol/shell-protocol-audit-2020-06.pdf).

There are two major parts to the protocol: **Assimilators** and **Curves** (formerly Shells). Assimilators allow the AMM to handle pairs of different value while also retrieving reported oracle prices for respective currencies. Curves allow the custom parameterization of the bonding curve with dynamic fees, halting bounderies, etc.

### Assimilators

Assimilators are a key part of the protocol, it converts all amounts to a "numeraire" which is essentially a base value used for computations across the entire protocol. This is necessary as we are dealing with pairs of different values.

Oracle price feeds are also piped in through the assimilator as they inform what numeraire amounts should be set. Since oracle price feeds report their values in USD, all assimilators attempt to convert token values to a numeraire amount based on USD.

### Curve Parameter Terminology

High level overview.

| Name      | Description                                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------- |
| Weights   | Weighting of the pair (only 50/50)                                                                        |
| Alpha     | The maximum and minimum allocation for each reserve                                                       |
| Beta      | Liquidity depth of the exchange; The higher the value, the flatter the curve at the reported oracle price |
| Delta/Max | Slippage when exchange is not at the reported oracle price                                                |
| Epsilon   | Fixed fee                                                                                                 |
| Lambda    | Dynamic fee captured when slippage occurs                                                                 |

For a more in-depth discussion, refer to [section 3 of the shellprotocol whitepaper](https://github.com/cowri/shell-solidity-v1/blob/master/Shell_White_Paper_v1.0.pdf)

### Major changes from the Shell Protocol

The main changes between our implementation and the original code can be found in the following files:

- All the assimilators
- `Curve.sol` (formerly `Shell.sol`)
- `CurveFactory.sol` (formerly `ShellFactory.sol`)
- `Router.sol`
- `ProportionalLiquidity.sol`
- `Swaps.sol`

#### Changing the term "Shell" to "Curve"

Throughout the repository, the term `Shell` has been changed to `Curve`. For example, `Shell.sol` has been **renamed** to `Curve.sol`, and `ShellFactory.sol` to `CurveFactory.sol`, etc.

#### Different Valued Pairs

In the original implementation, all pools are assumed to be baskets of like-valued tokens. In our implementation, all pools are assumed to be pairs of different-valued FX stablecoins (of which one side is always USDC).

This is achieved by having custom assimilators that normalize the foreign currencies to their USD counterparts. We're sourcing our FX price feed from chainlink oracles. See above for more information about assimilators.

Withdrawing and depositing related operations will respect the existing LP ratio. As long as the pool ratio hasn't changed since the deposit, amount in ~= amount out (minus fees), even if the reported price on the oracle changes. The oracle is only here to assist with efficient swaps.

## Third Party Libraries

- [Openzeppelin contracts (v3.3.0)](https://github.com/OpenZeppelin/openzeppelin-contracts/releases/tag/v3.3.0)
- [ABDKMath (v2.4)](https://github.com/abdk-consulting/abdk-libraries-solidity/releases/tag/v2.4)
- [Shell Protocol@48dac1c](https://github.com/cowri/shell-solidity-v1/tree/48dac1c1a18e2da292b0468577b9e6cbdb3786a4)

## Environment Variables
You can download the `.env` from the password manager

`.env` file variables

#### For Unit Test
```
# Tests only need these three variables
INFURA_PROJECT_ID=
ALCHEMY_PROJECT_ID=
MNEMONIC=

# Deployment
ENV=
ETHERSCAN_API_KEY=


# ---- ORACLES
ORACLES_USDC_USD=
ORACLES_USDT_USD=

ORACLES_CAD_USD=
ORACLES_AUD_USD=
ORACLES_GBP_USD=

ORACLES_SGD_USD=
ORACLES_EUR_USD=

ORACLES_TRYB_USD=
ORACLES_PHP_USD=

ORACLES_CHF_USD=
# ---- ORACLES


# ---- TOKEN ADDRESSES
TOKEN_ADDR_USDC=
TOKEN_ADDR_USDT=

TOKEN_ADDR_TCAD=
TOKEN_ADDR_TAUD=
TOKEN_ADDR_TGBP=

TOKEN_ADDR_XSGD=
TOKEN_ADDR_EURS=
TOKEN_ADDR_CADC=

TOKEN_ADDR_TRYB=
TOKEN_ADDR_PHP=

TOKEN_ADDR_JCHF=
# ---- TOKEN ADDRESSES


# ---- TOKEN DECIMALS
TOKENS_USDC_DECIMALS=6
TOKENS_USDT_DECIMALS=6

TOKENS_TCAD_DECIMALS=18
TOKENS_TAUD_DECIMALS=18
TOKENS_TGBP_DECIMALS=18

TOKENS_XSGD_DECIMALS=6
TOKENS_EURS_DECIMALS=2
TOKENS_CADC_DECIMALS=18

TOKEN_TRYB_DECIMALS=6
TOKEN_PHP_DECIMALS=18

TOKEN_JCHF_DECIMALS=18
# ---- TOKEN DECIMALS


# ---- AMM Contracts
CORE_CONTRACTS=Curves,Orchestrator,ProportionalLiquidity,Swaps,ViewLiquidity,Zap

# Assimilator and curve params
ASSIMILATOR_PAIRS=EURS_USDC,JCHF_USDC,PHP_USDC,TAUD_USDC,TCAD_USDC,TGBP_USDC,TRYB_USDC,XSGD_USDC
LPT_SYMBOL=HLP
# ---- AMM Contracts

CONFIRM_ALL=y
```

### Description

**RPC_URL**

This is the node address, if you are trying to run your local node, you need to use Alchemy’s endpoint in mainnet. This will start an instance of Hardhat Network that forks mainnet. This means that it will simulate having the same state as mainnet, but it will work as a local development network.

**MNEMONIC**

This is your deployer wallet's mnemonic seed.

*Note:*

When running a local node, your deployer wallet's addresses and private keys will be displayed in your local

Example.

<img width="576" alt="Screen Shot 2021-07-23 at 10 03 28 AM" src="https://user-images.githubusercontent.com/81855319/126729573-dd1a2153-ab7c-4d06-bdcb-8a68467c2dc9.png">


**ETHERSCAN_API_KEY**

This will be used for contract verifications

**ORACLES_[BASE]_[QUOTE]**

*e.g ORACLES_USDC_USD, ORACLES_EURS_USD*

These are the Chainlink's oracle addresses for currency pairs, this is used to get the FX rate of the base currency in USD. You can find these addresses in contracts under `/contracts/assimilators` directory

**TOKEN_[CURRENCY]**

*e.g TOKEN_USDC, TOKEN_EURS*

Token addresses for assimilators. You can find these addresses in contracts under `/contracts/assimilators` directory

**ASSIMILATOR_PAIRS**
*e.g EURS_USDC,JCHF_USDC

Used for creating new assimilator and curves, can be single value or comma separated if multiple

**LPT_SYMBOL**
Liquidity Provider Token symbold that will be displayed when a curve is created

**GOVERNANCE_ADDRESS**

Used to transfer ownership of a curve/pool/


**CONFIRM_ALL**

If set to **n**(no), then you will be asked wether you want to proceed or not on every contract deployment, setting this to *y* will proceed and bypass all the confirmation input

Example.

<img width="309" alt="Screen Shot 2021-07-23 at 10 52 11 AM" src="https://user-images.githubusercontent.com/81855319/126732382-7ad00c50-101c-488a-827f-5199b0a64002.png">

## Quickstart

### Local deployment
0. Update .env for the assimilators that you wish to deploy
```
ASSIMILATOR_PAIRS=EURS_USDC,XSGD_USDC,CADC_USDC
```

1. Deploy core contracts
```
> yarn deploy:local:1
```
2. Deploy assimilators
    - Note, usdc assimilator doesn't need to be deployed again and again, upon curve deloyment, script is just referencing to usdc assimialtor config in `dfx-protocol-clone/scripts/config/usdcassimilator`
    - Deploy assimilators (`ASSIMILATOR_PAIRS` env var)
    ```
    > yarn deploy:local:assimilators
    ```
3. Create new curve and set dimensions
```
> yarn deploy:local:3
```

Deploy everything in one command
```
> yarn deploy:local:all
```

Verify script for public networks (kovan for example)
```
> yarn deploy:kovan:verify
```

### Kovan deployment

0. Update .env for the assimilators & curves that you wish to deploy

1. Update oracle and usdc address of `contracts/assimilators/UsdcToUsdAssimilator.sol`

2. Run the deployment scripts
```
yarn deploy:kovan:1
yarn deploy:kovan:assimilators
yarn deploy:kovan:3
yarn deploy:kovan:verify // (optional)
```

### Adding a new curve

1. Verify that you have `factory_deployed.json` and `assimilators/USDCToUSDAssimilator.json` inside `scripts/config/<network>` diretory. These files are generated from previous deploy.

    Please refer to these confluence pages for the deployed addresses per network: 

    - https://halodao.atlassian.net/wiki/spaces/HALODAO/pages/137330714/Rewards+AMM+mapping
    - https://halodao.atlassian.net/wiki/spaces/HALODAO/pages/101023769/Deployed+Contracts

2. Create a new json config for the curve's base assimilator. This file will be placed in `scripts/halo/assimilatorConfigs/<network>`. **IMPORTANT:** this change needs to be merged via a PR so it can be reviewed by another peer.

3. Update .env for the assimilator and curve you wish to deploy.

    - For assimilator config, please refer to `dfx-protocol-clone6/scripts/halo/assimilatorConfigs/[network]/[currency]_USDC.json`
    - For curve config, please refer to `dfx-protocol-clone6/scripts/halo/curve/[network]/[currency]_USDC.json`
    - Assimilator and curve configs must have the same file name

4. Deploy the base assimilator
```
> yarn deploy:<network>:assimilators
```

5. Deploy the curve
```
> yarn deploy:kovan:3
```

# Router API

## Views

### viewOriginSwap

```javascript
function viewOriginSwap(
    address _quoteCurrency,
    address _origin,
    address _target,
    uint256 _originAmount
) external view returns (uint256 targetAmount_)
```

Views how much a target amount is returned given a fixed origin amount.

| Name            | Type    |                                             |
| --------------- | ------- | ------------------------------------------- |
| \_quoteCurrency | address | Address of the intermediate currency (USDC) |
| \_origin        | address | Address of the origin token                 |
| \_target        | address | Address of the target                       |
| \_originAmount  | uint256 | Amount of origin tokens to swap             |
| targetAmount\_  | uint256 | Amount of target tokens to received         |

### viewTargetSwap

```javascript
function viewTargetSwap(
    address _quoteCurrency,
    address _origin,
    address _target,
    uint256 _targetAmount
) external view returns (uint256 originAmount_)
```

Views how much a origin amount is required given a wanted target amount.

| Name            | Type    |                                             |
| --------------- | ------- | ------------------------------------------- |
| \_quoteCurrency | address | Address of the intermediate currency (USDC) |
| \_origin        | address | Address of the origin token                 |
| \_target        | address | Address of the target                       |
| \_targetAmount  | uint256 | Amount of target tokens wanted              |
| originAmount\_  | uint256 | Amount of origin tokens required            |

## State Changing

### originSwap

```javascript
function originSwap(
    address _quoteCurrency,
    address _origin,
    address _target,
    uint256 _originAmount,
    uint256 _minTargetAmount,
    uint256 _deadline
)
```

Swaps a fixed origin amount for a dynamic target amount.

| Name              | Type    |                                                          |
| ----------------- | ------- | -------------------------------------------------------- |
| \_quoteCurrency   | address | Address of the intermediate currency (USDC)              |
| \_origin          | address | Address of the origin token                              |
| \_target          | address | Address of the target                                    |
| \_originAmount    | uint256 | Amount of origin tokens to swap                          |
| \_minTargetAmount | uint256 | Minimum amount of target tokens to receive               |
| \_deadline        | uint256 | Epoch time of which the transaction must be completed by |

# Curve API

## Views

### viewOriginSwap

```javascript
function viewOriginSwap(
    address _origin,
    address _target,
    uint256 _originAmount
) external view returns (uint256 targetAmount_)
```

Views how much a target amount is returned given a fixed origin amount.

| Name           | Type    |                                     |
| -------------- | ------- | ----------------------------------- |
| \_origin       | address | Address of the origin token         |
| \_target       | address | Address of the target               |
| \_originAmount | uint256 | Amount of origin tokens to swap     |
| targetAmount\_ | uint256 | Amount of target tokens to received |

### viewTargetSwap

```javascript
function viewTargetSwap(
    address _origin,
    address _target,
    uint256 _targetAmount
) external view returns (uint256 originAmount_)
```

Views how much a origin amount is needed given for a fixed target amount.

| Name           | Type    |                                             |
| -------------- | ------- | ------------------------------------------- |
| \_origin       | address | Address of the origin token                 |
| \_target       | address | Address of the target                       |
| \_targetAmount | uint256 | Amount of target tokens to receive          |
| originAmount\_ | uint256 | Amount of origin tokens to needed to supply |

### viewDeposit

```javascript
function viewDeposit(
    uint256 _deposit
) external view returns (uint256 curveTokens_, uint256[] memory amounts_)
```

Views how many curve lp tokens will be minted for a given deposit, as well as the amount of tokens required from each asset.

**Note that `_deposit` is denominated in 18 decimals.**

| Name          | Type      |                                                        |
| ------------- | --------- | ------------------------------------------------------ |
| \_deposit     | address   | Total amount of tokens to deposit (denominated in USD) |
| curveTokens\_ | uint256   | Amount of LP tokens received                           |
| amounts\_     | uint256[] | Amount of tokens for each address required             |

For example, if the CAD/USD rate was 0.8, a `deposit` of `100e18` will require 50 USDC and 50 USDC worth of CAD, which is 50/0.8 = 62.5 CADC.

### viewWithdraw

```javascript
function viewWithdraw(
    uint256 _curvesToBurn
) external view returns (uint256[] memory amounts_)
```

Views how many tokens you will receive for each address when you burn `_curvesToBurn` amount of curve LP tokens.

| Name           | Type      |                                            |
| -------------- | --------- | ------------------------------------------ |
| \_curvesToBurn | uint256   | Amount of LP tokens to burn                |
| amounts\_      | uint256[] | Amount of tokens for each address received |

## State Changing

Note you'll need to approve tokens to the curve address before any of the following can be performed.

### originSwap

```javascript
function originSwap(
    address _origin,
    address _target,
    uint256 _originAmount,
    uint256 _targetAmount,
    uint256 _deadline
)
```

Swaps a fixed origin amount for a dynamic target amount.

| Name              | Type    |                                                          |
| ----------------- | ------- | -------------------------------------------------------- |
| \_origin          | address | Address of the origin token                              |
| \_target          | address | Address of the target                                    |
| \_originAmount    | uint256 | Amount of origin tokens to swap                          |
| \_minTargetAmount | uint256 | Minimum amount of target tokens to receive               |
| \_deadline        | uint256 | Epoch time of which the transaction must be completed by |

### targetSwap

```javascript
function targetSwap(
    address _origin,
    address _target,
    uint256 _maxOriginAmount,
    uint256 _targetAmount,
    uint256 _deadline
)
```

Swaps a dynamic origin amount for a fixed target amount

| Name              | Type    |                                                          |
| ----------------- | ------- | -------------------------------------------------------- |
| \_origin          | address | Address of the origin token                              |
| \_target          | address | Address of the target                                    |
| \_maxOriginAmount | uint256 | Maximum amount of origin tokens to swap                  |
| \_targetAmount    | uint256 | Amount of target tokens that wants to be received        |
| \_deadline        | uint256 | Epoch time of which the transaction must be completed by |

### deposit

```javascript
function deposit(
    uint256 _deposit,
    uint256 _deadline
)
```

Deposit into the pool a proportional amount of assets. The ratio used to calculate the proportional amount is determined by the pool's ratio, not the oracles. This is to prevent LPs from getting rekt'ed.

On completion, a corresponding amount of curve LP tokens is given to the user.

**Note that `_deposit` is denominated in 18 decimals.**

| Name       | Type    |                                                          |
| ---------- | ------- | -------------------------------------------------------- |
| \_deposit  | address | Total amount of tokens to deposit (denominated in USD)   |
| \_deadline | address | Epoch time of which the transaction must be completed by |

For example, if the CAD/USD rate was 0.8, a `deposit` of `100e18` will require 50 USDC and 50 USDC worth of CAD, which is 50/0.8 = 62.5 CADC.

### withdraw

```javascript
function withdraw(
    uint256 _curvesToBurn,
    uint256 _deadline
)
```

Withdraw amount of tokens from the pool equally.

**Note that the amount is denominated in 18 decimals.**

| Name           | Type    |                                                          |
| -------------- | ------- | -------------------------------------------------------- |
| \_curvesToBurn | address | The amount of curve LP tokens to burn                    |
| \_deadline     | address | Epoch time of which the transaction must be completed by |
