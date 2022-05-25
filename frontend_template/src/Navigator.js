import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected} from "./utils/interact";
// import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink, MDBContainer, MDBView, MDBMask } from 'mdbreact';
// import { BrowserRouter as Router } from 'react-router-dom';
const Navigator = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");


  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("");
          
        }
      });
    } else {
        console.log('hi');
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

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setWallet(walletResponse.address);
  };


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
    </div>
  );
};

export default Navigator;
