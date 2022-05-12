import React, { useState } from "react";
import Web3 from "web3";
import './App.css';
import { ERC20AbiJson } from "./abiJsons";

var web3;
if (window.ethereum) {
	web3 = new Web3(window.ethereum);
}
// Legacy DApp Browsers
else if (window.web3) {
	web3 = new Web3(window.web3.currentProvider);
}
// Non-DApp Browsers
else {
	alert('You have to install MetaMask !');
}

export default function App() {
	const [account, setAccount] = useState("");
	const [tokenAddress, settokenAddress] = useState("");
	const [balance, setBalance] = useState(0);
	const [connected, setConnected] = useState(false);
	const [error, setError] = useState("");

	async function connect() {
		if (window.ethereum && !connected) {
			try {
				const accounts = await web3.eth.requestAccounts();
				setAccount(accounts[0]);
				setConnected(true);
			} catch (e) {
				if (e.code === 4001) {
					console.log("User rejected request!")
				}
				setError(e.message);
			}
		}
		else {
			return {
				connectedStatus: false,
				status: "🦊 You must install Metamask into your browser: https://metamask.io/download.html"
			}
		}
	}

	async function getBalance(event) {
		event.preventDefault();
		if (window.ethereum && connected) {
			try {
				let bal = 0;
				console.log(tokenAddress);
				if (tokenAddress === "") {
					bal = await web3.eth.getBalance(account);
				}
				else {
					const contract = new web3.eth.Contract(ERC20AbiJson, tokenAddress);
					bal = await contract.methods.balanceOf(account).call();
				}
				setBalance(web3.utils.fromWei(bal));
			} catch (e) {
				setError(e.message);
			}
		}
		else {
			return {
				connectedStatus: false,
				status: "🦊 You must install Metamask into your browser: https://metamask.io/download.html"
			}
		}
	}

	function handleTokenChange(e) {
		settokenAddress(e.target.value);
	}

	function disconnect() {
		setAccount("");
		setConnected(false);
		setBalance(0);
	}

	// function transer(){
	// 	web3.sendTransaction({to:receiver, from:sender, value:web3.toWei("0.5", "ether")})
	// }


	return (
		<div className="App">
			<header className="App-header">
				<p>Your account: {account}</p>
				<form onSubmit={(event) => getBalance(event)}>
					<p>ERC20token address:
						<input type="text" placeholder="please enter token address" onChange={(e) => handleTokenChange(e)} value={tokenAddress} />
					</p>
				</form>
				<p>Your balance: {balance}</p>
				<button onClick={connect}>
					Connect to metamask!
				</button>
				<button onClick={disconnect}>
					Disconnect to metamask!
				</button>
				<p>Error: {error}</p>
			</header>
		</div>

	);
}