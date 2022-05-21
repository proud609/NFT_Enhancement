import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT, getTokensCount, getTokens, upgrade, cheat } from "./utils/interact.js";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [counts, setCounts] = useState(0);
  const [imgs, setImgs] = useState([]);


  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  useEffect(() => {
    async function init() {
      const { address } = await getCurrentWalletConnected();
      setWallet(address)
      addWalletListener();
    }
    init();
  }, []);

  const fetchMetedata = async () => {
    const { counts } = await getTokensCount();
    setCounts(counts);
    const { imgs, status } = await getTokens(counts);
    console.log(imgs);
    setImgs(imgs);
    setStatus(status);
  }

  // console.log(stream);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { status } = await mintNFT();
    setStatus(status);
  };

  const onUpgrade = async (tokenId) => {
    const { status } = await upgrade(tokenId);
    setStatus(status);
  }

  const onCheat = async (tokenId) => {
    const { status } = await cheat(tokenId);
    setStatus(status);
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      <p>Tokens Count:{counts}</p>
      <br></br>
      <h1 id="title">🧙‍♂️ Alchemy NFT Minter</h1>
      {imgs.map((e, i) => {
        return <div key={i}>
          <img src={e.image}></img>
          <button onClick={() => { onUpgrade(e.tokenId) }}>
            upgrade
          </button>
          <button onClick={() => { onCheat(e.tokenId) }}>
            cheat
          </button>
        </div>
      })}
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <button id="mintButton" onClick={fetchMetedata}>
        Fetch Data
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;
