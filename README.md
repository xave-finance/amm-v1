# Switch to master to see the original documentation


## Running Tests
Make sure to use Alchemy mainnet node as RPC_URL in .env, we need a node that has an archival data and Alchemy has it for free. Please see .env.example

1. Start the local testnet:

   ```
   yarn hh:node
   ```

This will create an instance of Hardhat Network that forks mainnet. This means that it will simulate having the same state as mainnet, but it will work as a local development network. That way you can interact with deployed protocols and test complex interactions locally.

[Mainnet forking](https://hardhat.org/guides/mainnet-forking.html)

[See Line 59](https://github.com/HaloDAO/dfx-protocol-clone/blob/967ecd3ec8b1cd62ebfdb3e5a1542ebe861b5975/hardhat.config.ts#L59)

[Block Number](https://etherscan.io/block/12640151)

2. Run test

   ```
   yarn test
   ```
   
<img width="720" alt="Screen Shot 2021-06-16 at 2 42 59 PM" src="https://user-images.githubusercontent.com/81855319/122170446-27f78c00-ceb1-11eb-8bc7-670941dfca07.png">
