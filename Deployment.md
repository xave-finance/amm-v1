# Environment Variables

Below list the most important vars on our `.env` with regarding to deployment.

```
# Token Addresses
# Used on the curve deployment script. Add as required, each curve tokens needs to be here.
# Change the addresses accordingly per network you wish to deploy to.
TOKEN_ADDR_USDC=0x0
TOKEN_ADDR_EURS=0x0
TOKEN_ADDR_FXPHP=0x0

# Token decimals
# Used on the curve deployment script. Add as required, each curve tokens needs to be here.
TOKENS_USDC_DECIMALS=6
TOKENS_EURS_DECIMALS=2
TOKENS_FXPHP_DECIMALS=18

# Core contracts to be deployed on `deploy:<network>:1` command  (don't change)
CORE_CONTRACTS=Curves,Orchestrator,ProportionalLiquidity,Swaps,ViewLiquidity,Zap

# USDC assimilator (don't change)
ASSIMILATORS=UsdcToUsdAssimilator

# List of base assimilators and curves you wish to deploy
ASSIMILATOR_PAIRS=EURS_USDC,FXPHP_USDC

# LPT token symbol (don't change)
LPT_SYMBOL=HLP
```

You can download the full `.env` from 1password.

# Full AMM deployment

1. Deploy core contracts (Factory + Libs + Zap)

    **Pre deployment:** if deploying to other networks aside from mainnet, update the hardcoded USDC address (in checksum format) in `Zap.sol` first with the correct USDC address on the chosen network before running the below command

    ```
    > yarn deploy:<network>:1
    ```

2. Deploy USDC assimilator

    **Pre deployment:** if deploying to other networks aside from mainnet, update the hardcoded USDC & orcle address (in checksum format) in `UsdcToUsdAssimilator.sol` first with the correct USDC address on the chosen network before running the below command

    ```
    > yarn deploy:<network>:2
    ```

    **Post deployment:** add the newly deployed USDC assimilator address to `./scripts/config/usdcassimilator/<network>.json`. Be sure to commit this change on source control as this needs to end up in our repo.

2. Deploy base assimilator(s)

    **Pre deployment:** specify the base assimilators you wish to deploy on the `ASSIMILATOR_PAIRS` var in the `.env` file first before running the below command

    ```
    > yarn deploy:<network>:assimilators
    ```

3. Create the new curve(s)

    **Pre deployment:**
    
    - specify the curves you wish to deploy on the `ASSIMILATOR_PAIRS` var in the `.env` file first before running the below command

    - correct curve tokens address and decimals should also be specified in the `.env` file represented by `TOKEN_ADDR_<SYMBOL>` & `TOKEN_<SYMBOL>_DECIMALS` accordingly

    ```
    > yarn deploy:<network>:3
    ```

## Verifying the contracts

Simply run the following command

```
> yarn deploy:<network>:verify
```

# Adding new curve to an existing AMM

1. Create the json config file for the new curve(s) and assimilator(s) you wish to deploy

    - `scripts/halo/assimilatorConfigs/<network>/<base_token_symbol>_USDC.json`
    - `scripts/halo/curveConfigs/<network>/<base_token_symbol>_USDC.json`

    You can refer to the existing config files on each respective folders above as template for the config file you will be creating - change the value accordingly like token addresses, decimals, etc. Other stuff like curve params needs be coordinated with the team.

    **IMPORTANT:** Raise a PR with the new config file(s), this needs to be reviewed by at least 2 peers before we can proceed with the next step

2. Before deploying, be sure that you have the following files in `scripts/config/`:

    - `<network>/factory_deployed.json` -> this contains the contract addresses from the previous deployment
    - `usdcassimilator/<network>.json` -> contains the USDC assimilator address from the previous deployment

    Please refer to https://halodao.atlassian.net/wiki/spaces/HALODAO/pages/137330714/Rewards+AMM+mapping for the zip files of the previous deployments

    All contract addresses can also be found & reviewed here: https://halodao.atlassian.net/wiki/spaces/HALODAO/pages/1048659/Contract+Addresses

3. Ensure that your `.env` has the necessary vars for this deployment

    As an example, deploying a FXPHP_USDC curve on arbitrum should have the following env vars:

    ```
    TOKEN_ADDR_FXPHP=0x3d147cD9aC957B2a5F968dE9d1c6B9d0872286a0
    TOKENS_FXPHP_DECIMALS=18
    ASSIMILATOR_PAIRS=FXPHP_USDC
    ```

3. Deploy the base assimilator(s)

   ```
   > yarn deploy:<network>:assimilators
   ```

4. Create the new curve(s)

   ```
   > yarn deploy:<network>:3
   ```
