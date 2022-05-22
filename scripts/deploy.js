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
	.addParam("upgradeFee", "The fee to upgrade your NFT", "0")
	.addParam("topLevel", "The highest level", "10")
	.addParam("baseUri", "The baseUri of the contract", "https://gateway.pinata.cloud/ipfs/QmPqcrgkUEwEXusTz6GECTUAfYpPfz9mAmaQuJeLHvvt3x/")
	.addParam("staticUri", "The staticUri of the contract", "https://gateway.pinata.cloud/ipfs/QmPqcrgkUEwEXusTz6GECTUAfYpPfz9mAmaQuJeLHvvt3x/0.json")
	.setAction(async function (taskArguments, hre) {
		const nftContractFactory = await hre.ethers.getContractFactory("Enhancement", getAccount());
		const nft = await nftContractFactory.deploy(taskArguments.name, taskArguments.symbol, taskArguments.price, taskArguments.upgradeFee, taskArguments.topLevel, taskArguments.baseUri, taskArguments.staticUri);
		console.log(`Contract deployed to address: ${nft.address}`);
	});