const { task } = require("hardhat/config");
const { getAccount } = require("./helpers");


task("check-balance", "Prints out the balance of your account").setAction(async function (taskArguments, hre) {
	const account = getAccount();
	console.log(`Account balance for ${account.address}: ${await account.getBalance()}`);
});

task("deploy", "Deploys the NFT.sol contract")
	.addParam("name", "The name of the contract", "Enhancement")
	.addParam("symbol", "The symbol of the contract", "EHM")
	.addParam("price", "The price of the NFT", "100000000000000")
	.addParam("baseUri", "The baseUri of the contract", "https://bafybeia5osgiwxx6ywvxh45o3rtxcce4k3l2vd7yk3vi73kcm5zxihplxe.ipfs.nftstorage.link/metadata/")
	.addParam("staticUri", "The staticUri of the contract", "https://bafybeia5osgiwxx6ywvxh45o3rtxcce4k3l2vd7yk3vi73kcm5zxihplxe.ipfs.nftstorage.link/metadata/0.json")
	.setAction(async function (taskArguments, hre) {
		const nftContractFactory = await hre.ethers.getContractFactory("Reinforce", getAccount());
		const nft = await nftContractFactory.deploy(taskArguments.name, taskArguments.symbol, taskArguments.baseUri, taskArguments.oldUri);
		console.log(`Contract deployed to address: ${nft.address}`);
	});