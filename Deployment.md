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

TOKENS_TRYB_DECIMALS=6
TOKENS_PHP_DECIMALS=18

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
    - Deploy USDC assimilator (`ASSIMILATORS` env var), you will need to add the new deployed address in `./scripts/config/usdcassimilator/localhost.json`
    ```
    > yarn deploy:local:2
    ```

    - Deploy other assimilators (`ASSIMILATOR_PAIRS` env var)
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
1. Run the deployment scripts, non localhost deployment will automatically get the usdc assimilator address from `./scripts/config/usdcassimilator/`
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
