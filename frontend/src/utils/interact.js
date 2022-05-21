import Web3 from "web3";

var web3;

const contractABI = require('../contract-abi.json')
const contractAddress = "0x97F814F3E3D43627EffcA600Cbc62831Cda17cdD";

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
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
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const mintNFT = async () => {
  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    'data': window.contract.methods.mint(1).encodeABI() //make call to NFT smart contract 
  };

  //sign transaction via Metamask
  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    return {
      success: true,
      status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }
}

export const getTokensCount = async () => {
  try {
    const counts = await window.contract.methods.balanceOf(window.ethereum.selectedAddress).call();
    return {
      success: true,
      counts: counts,
      status: "✅ fetch Data success"
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }
}

export const getBaseURI = async () => {
  try {
    const baseUri = await window.contract.methods.baseURI().call();
    return {
      success: true,
      baseUri: baseUri,
      status: "✅ fetch count success"
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }
}

export const getTokens = async (counts) => {
  let imgs = []
  try {
    // const { baseUri } = await getBaseURI();
    for (let i = 0; i < counts; i++) {
      const tokenId = await window.contract.methods.tokenOfOwnerByIndex(window.ethereum.selectedAddress, i).call();
      console.log(tokenId)
      const tokenUri = await window.contract.methods.tokenURI(tokenId).call();
      console.log(tokenUri)
      let [f, s] = tokenUri.split("https://")[1].split(".ipfs.nftstorage.link")
      let json = await fetchJson("https://ipfs.io/ipfs/" + f + s);
      let img = {
        image: json.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
        tokenId: tokenId
      };
      imgs.push(img);
    }
    return {
      success: true,
      imgs: imgs,
      status: "✅ fetch token success"
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }
}

export const fetchJson = async (url) => {
  const response = await fetch(url);
  return await response.json();
}

export const fetchImage = async (url) => {
  const res = await fetch(url);
  const imageBlob = await res.blob();
  const imageObjectURL = URL.createObjectURL(imageBlob);
  return imageObjectURL;
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
    return {
      success: true,
      status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
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
    console.log("cheating...");
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });
    return {
      success: true,
      status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }
}