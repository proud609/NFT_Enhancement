import Web3 from "web3";
var web3;
const contractABI = require('../contract-abi.json')
const contractAddress = "0xa023C4Cf219AF98B942dD650ea41Ad760Dd22579";

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      window.contract = await new web3.eth.Contract(contractABI, contractAddress);
      return { "address": addressArray[0] }
    } catch (err) {
      return {
        address: "",
        err: " Something went wrong: " + err.message
      }
    }
  } else {
    return {
      address: "",
      warning: "You must install Metamask, a virtual Ethereum wallet, in your browser"
    }
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();
        return {
          address: addressArray[0],
        };
      } else {
        return {
          address: "",
          warning: "Connect to Metamask using the top right button."
        }
      }
    } catch (err) {
      return {
        address: "",
        err: " Something went wrong: " + err.message
      }
    }
  } else {
    return {
      address: "",
      warning: "You must install Metamask, a virtual Ethereum wallet, in your browser"
    }
  }
};

export const getTransactionReceiptMined = (txHash, interval) => {
  const self = this;
  const transactionReceiptAsync = function (resolve, reject) {
    web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
      if (error) {
        reject(error);
      } else if (receipt == null) {
        setTimeout(
          () => transactionReceiptAsync(resolve, reject),
          interval ? interval : 500);
      } else {
        resolve(receipt);
      }
    });
  };

  if (Array.isArray(txHash)) {
    return Promise.all(txHash.map(
      oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
  } else if (typeof txHash === "string") {
    return new Promise(transactionReceiptAsync);
  } else {
    throw new Error("Invalid Type: " + txHash);
  }
};

export const mintNFT = async () => {
  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    'data': window.contract.methods.mint().encodeABI(), //make call to NFT smart contract 
    value: "100000000000000"
  };

  //sign transaction via Metamask
  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    await getTransactionReceiptMined(txHash);
    return {
      success: true,
      status: "Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txHash
    }
  } catch (error) {
    return {
      success: false,
      status: " Something went wrong: " + error.message
    }
  }
}

export const getTokensCount = async () => {
  try {
    const counts = await window.contract.methods.balanceOf(window.ethereum.selectedAddress).call();
    return {
      success: true,
      counts: counts,
    }
  } catch (error) {
    return {
      success: false,
      counts: 0,
      status: "Something went wrong: " + error.message
    }
  }
}

export const getBaseURI = async () => {
  try {
    const baseUri = await window.contract.methods.baseURI().call();
    return {
      success: true,
      baseUri: baseUri,
      status: "fetch count success"
    }
  } catch (error) {
    return {
      success: false,
      baseUri: "",
      status: "Something went wrong: " + error.message
    }
  }
}

export const getTokens = async (counts) => {
  let data = []
  try {
    // const { baseUri } = await getBaseURI();
    for (let i = 0; i < counts; i++) {
      const tokenId = await window.contract.methods.tokenOfOwnerByIndex(window.ethereum.selectedAddress, i).call();
      console.log(tokenId);
      const tokenUri = await window.contract.methods.tokenURI(tokenId).call();
      console.log(tokenUri);
      let json = await fetchJson(tokenUri);
      json.animation_url = json.animation_url.replace("ipfs://", "https://opensea.mypinata.cloud/ipfs/");
      json.tokenId = tokenId;
      data.push(json);
    }
    return {
      success: true,
      data: data,
      status: "fetch token success"
    }
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message
    }
  }
}

export const fetchJson = async (url) => {
  const response = await fetch(url);
  return await response.json();
}

export const refresh = async (tokenId) => {
  try {
    const tokenUri = await window.contract.methods.tokenURI(tokenId).call();
    console.log(tokenUri);
    let json = await fetchJson(tokenUri);
    json.animation_url = json.animation_url.replace("ipfs://", "https://opensea.mypinata.cloud/ipfs/");
    json.tokenId = tokenId;
    json.success = true;
    return {
      success: true,
      json: json,
      status: "fetch token success"
    }
  } catch (error) {
    return {
      success: false,
      status: "Something went wrong: " + error.message
    }
  }
}

export const upgrade = async (tokenId) => {
  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    'data': window.contract.methods.upgrade(tokenId).encodeABI() //make call to NFT smart contract 
  };

  //sign transaction via Metamask
  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    await getTransactionReceiptMined(txHash);
    return {
      success: true,
      status: "Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txHash
    }
  } catch (error) {
    return {
      success: false,
      status: " Something went wrong: " + error.message
    }
  }
}

export const cheat = async (tokenId) => {
  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    'data': window.contract.methods.cheat(tokenId).encodeABI() //make call to NFT smart contract 
  };

  //sign transaction via Metamask
  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    await getTransactionReceiptMined(txHash);
    return {
      success: true,
      status: "Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txHash
    }
  } catch (error) {
    return {
      success: false,
      status: " Something went wrong: " + error.message
    }
  }
}