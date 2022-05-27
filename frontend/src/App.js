import 'antd/dist/antd.css';
import { useEffect, useState, React } from 'react';
import { Layout, Button, message, Typography, Row, Col, Affix } from 'antd';
import { WalletOutlined, FireFilled } from '@ant-design/icons';
import { getTokens, connectWallet, getCurrentWalletConnected, getTokensCount, mintNFT } from './utils/interact';
import Minter from './Components/Minter';
import logo from './logo.png';


const { Header, Footer, Content } = Layout;
const { Text } = Typography;

const ownerAddress = "0xF75c2908daCC7Da7953f13DA8444C3b2977E6b67";


function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [minting, setMinting] = useState(false);
  const [counts, setCounts] = useState(0);
  const [data, setData] = useState([]);


  const successMessage = (success) => {
    message.success(success);
  };

  const errorMessage = (error) => {
    message.error(error, 5);
  };

  const warningMessage = (warning) => {
    message.warning(warning);
  };

  const connectWalletPressed = async () => {
    setConnecting(true);
    const walletResponse = await connectWallet();
    if (walletResponse.err) {
      errorMessage(walletResponse.err);
    }
    if (walletResponse.warning) {
      warningMessage(walletResponse.warning);
    }
    setWalletAddress(walletResponse.address);
    fetchMetedata();
    setConnecting(false);
  };

  const onMintPressed = async () => {
    setMinting(true);
    const { success, status } = await mintNFT();
    if (success) {
      successMessage(status);
    }
    else {
      errorMessage(status)
    }
    setMinting(false);
    fetchMetedata();
  };

  const fetchMetedata = async () => {
    setFetching(true)
    const countResponse = await getTokensCount();
    if (countResponse.success) {
      setCounts(countResponse.counts);
      const tokensResponse = await getTokens(countResponse.counts);
      if (tokensResponse.success) {
        setData(tokensResponse.data);
      }
      else {
        errorMessage(tokensResponse.status);
      }
    }
    else {
      errorMessage(countResponse.status);
    }
    setFetching(false)
  }

  useEffect(() => {
    const addWalletListener = () => {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          } else {
            setWalletAddress("");
          }
        });
      } else {
        warningMessage("You must install Metamask, a virtual Ethereum wallet, in your browser");
      }
    }
    async function init() {
      const walletResponse = await getCurrentWalletConnected();
      if (walletResponse.err) {
        errorMessage(walletResponse.err);
      }
      if (walletResponse.warning) {
        warningMessage(walletResponse.warning);
      }
      setWalletAddress(walletResponse.address);
      addWalletListener();
      fetchMetedata();
    }
    init();
  }, []);


  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%', height: "10vh", backgroundColor: "rgb(50,100,255)" }} >
          <Row justify="space-between">
            <Col span={8} style={{ textAlign: "center" }}>
              <div className='logo'>
                <img src={logo} width="50%" style={{}} alt="logo" />
              </div>
            </Col>
            <Col span={8} style={{ textAlign: "center" }}>
              <Text strong style={{ color: "white", fontSize: "24px" }}>Tokens Count:{counts}</Text>
            </Col>
            <Col span={8} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                icon={<WalletOutlined />}
                loading={connecting}
                onClick={connectWalletPressed}
                disabled={walletAddress.length > 0}
              >
                {walletAddress.length > 0 ?
                  `Connected: ${walletAddress}`
                  : "Connect Wallet"}
              </Button>
            </Col>
          </Row>
        </Header>
        <Content style={{
          padding: '0 50px',
          marginTop: 90,
        }}>
          <Minter
            isOwner={ownerAddress.toLowerCase() === walletAddress.toLowerCase()}
            data={data}
            setData={setData}
            fetching={fetching}
            successMessage={successMessage}
            setCounts={setCounts}
            warningMessage={warningMessage}
            errorMessage={errorMessage}>
          </Minter>
        </Content>
        <Footer style={{ textAlign: "center" }}>Created by NFT Enhancement System team @2022</Footer>
        <div style={{ textAlign: "left" }}>
          <Affix style={{ position: 'fixed', bottom: 10, right: 10 }}>
            <Button
              onClick={onMintPressed}
              loading={minting}
              block
              shape='circle'
              icon={<FireFilled />}
              style={{width:"150px", height:"150px", fontSize:"40px", backgroundColor:"black", color:"white"}}
            >
              Mint
            </Button>
          </Affix>
        </div>
      </Layout>
    </>
  )
}

export default App;