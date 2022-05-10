const { task } = require("hardhat/config");
const { getContract } = require("./helpers");
const { ethers } = require("ethers")
const fetch = require("node-fetch");

task("set-price", "set the price of the NFT")
	.addParam("newPrice", "The address to receive payment")
	.setAction(async function (taskArguments, hre) {
		const contract = await getContract("Reinforce", hre);
		const transactionResponse = await contract.setPrice(taskArguments.newPrice, {
			gasLimit: 500_000,
		});
		console.log(`Transaction Hash: ${transactionResponse.hash}`);
	});

task("withdraw", "withdraw payments from the NFT contract")
	.addParam("address", "The address to receive payment")
	.setAction(async function (taskArguments, hre) {
		const contract = await getContract("Reinforce", hre);
		const transactionResponse = await contract.withdrawPayments(taskArguments.address, {
			gasLimit: 500_000,
		});
		console.log(`Transaction Hash: ${transactionResponse.hash}`);
	});

task("mint", "Mints from the NFT contract")
	.addParam("mintAmount", "The amount to mint")
	.setAction(async function (taskArguments, hre) {
		const contract = await getContract("Reinforce", hre);
		const transactionResponse = await contract.mint(taskArguments.mintAmount, {
			// value: ethers.utils.parseEther("0.001"),
			gasLimit: 500_000,
		});
		console.log(`Transaction Hash: ${transactionResponse.hash}`);
	});

task("set-base-token-uri", "Sets the base token URI for the deployed smart contract")
	.addParam("baseUrl", "The base of the tokenURI endpoint to set")
	.setAction(async function (taskArguments, hre) {
		const contract = await getContract("Reinforce", hre);
		const transactionResponse = await contract.setBaseTokenURI(taskArguments.baseUrl, {
			gasLimit: 500_000,
		});
		console.log(`Transaction Hash: ${transactionResponse.hash}`);
	});

task("set-base-extension", "Sets the base token URI for the deployed smart contract")
	.addParam("baseExtension", "The base of the tokenURI endpoint to set")
	.setAction(async function (taskArguments, hre) {
		const contract = await getContract("Reinforce", hre);
		const transactionResponse = await contract.setBaseExtension(taskArguments.baseExtension, {
			gasLimit: 500_000,
		});
		console.log(`Transaction Hash: ${transactionResponse.hash}`);
	});


task("token-uri", "Fetches the token metadata for the given token ID")
	.addParam("tokenId", "The tokenID to fetch metadata for")
	.setAction(async function (taskArguments, hre) {
		const contract = await getContract("Reinforce", hre);
		const response = await contract.tokenURI(taskArguments.tokenId, {
			gasLimit: 500_000,
		});

		const metadata_url = response;
		console.log(`Metadata URL: ${metadata_url}`);

		const metadata = await fetch(metadata_url).then(res => res.json());
		console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`);
	});