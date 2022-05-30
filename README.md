# NFT_Enhancement
Final project

## Follow steps to deploy your own EHM
1. create an .env file which include four keys
   1. ALCHEMY_KEY=
   2. ACCOUNT_PRIVATE_KEY=
   3. NFT_CONTRACT_ADDRESS= // after deploy the contract, you can interact with it
   4. ETHERSCAN_API_KEY= // for verify on Etherscan
2. ```npm install```
3. ```npx hardhat compile```
4. ```npx hardhat deploy``` // with some parameters in scripts/deploy.js
5. ```npx hardhat verify <NFT_CONTRACT_ADDRESS>``` //  with some parameters in scripts/deploy.js
6. ``npx hardhat help`` // to see what can you do to interact with your contract

## Follow steps to start frontend
1. ```cd frontend && npm install```
2. Edit contractAddress in frontend/src/utils/interact.js
3. ```npm start```
4. Happy minting and upgrading!

>Notice: It cost your contract **one LINK token** when upgrading!