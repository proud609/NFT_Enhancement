import { ProCard } from '@ant-design/pro-card';
import '@ant-design/pro-card/dist/card.css';
import { Button, Empty, Spin, Card, Typography, Row, Col } from 'antd';
import React, { useState } from 'react';
import { LoadingOutlined } from "@ant-design/icons";
import { upgrade, cheat, refresh } from '../utils/interact';
const { Title } = Typography;

const Minter = ({ setData, isOwner, data, fetching, successMessage, errorMessage, warningMessage }) => {

  const [refreshing, setRefreshing] = useState(false);

  const onUpgrade = async (tokenId) => {
    const { success, status } = await upgrade(tokenId);
    if (success) {
      successMessage(status);
    }
    else {
      errorMessage(status)
    }
  }

  const onCheat = async (tokenId) => {
    const { success, status } = await cheat(tokenId);
    if (success) {
      successMessage(status);
    }
    else {
      errorMessage(status)
    }
  }

  const onRefresh = async (tokenId, i) => {
    setRefreshing(true);
    const { success, json, status } = await refresh(tokenId);
    if (success) {
      successMessage(status);
      let newData = [...data]
      newData[i] = json
      setData(newData);
    }
    else {
      errorMessage(status)
    }
    setRefreshing(false)
  }

  return (
    <>
      {data.length > 0 ?
        data.map((e, i) => {
          return (
            <Spin spinning={refreshing} key={i}>
              <ProCard split="vertical" bordered>
                <ProCard colSpan="33%">
                  <iframe src={e.animation_url}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    frameBorder="0" sandbox="allow-scripts"
                    style={{ "minHeight": "500px", "width": "400px" }}>
                  </iframe>
                </ProCard>
                <ProCard title={<Title>{e.name}</Title>} headerBordered>
                  <Card type='inner' title="Description">
                    {e.description}
                  </Card>
                  <Card type='inner' title="Token ID">
                    {e.tokenId}
                  </Card>
                  <br />
                  <Row>
                    <Col span={4} >
                      <Button type="primary" size="large" shape="round" onClick={() => onUpgrade(e.tokenId)}>upgarde</Button>
                    </Col>
                    <Col span={4} >
                      <Button type="primary" size="large" shape="round" onClick={() => onRefresh(e.tokenId, i)}>refresh</Button>
                    </Col>
                    <Col span={4} >
                      <Button type="primary" size="large" shape="round" onClick={() => onCheat(e.tokenId)} disabled={!isOwner}>cheat</Button>
                    </Col>
                  </Row>
                </ProCard>
              </ProCard>
            </Spin>)
        })
        : fetching ?
          <div style={{ textAlign: "center" }}>
            <Spin
              tip="Loading..."
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 80, }} />}
              style={{ fontSize: 50 }}></Spin>
          </div>
          : <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 400,
            }}
            description={
              <span>
                Mint your first EHM!
              </span>
            }
          >
          </Empty>}
    </>
  )
};

export default Minter;

// import { useEffect, useState } from "react";
// import { connectWallet, getCurrentWalletConnected, mintNFT, getTokensCount, getTokens, upgrade, cheat } from "../utils/interact.js";

// const Minter = (props) => {

//   //State variables
//   const [imgs, setImgs] = useState([]);

//   const fetchMetedata = async () => {
//     const { counts } = await getTokensCount();
//     setCounts(counts);
//     const { imgs, status } = await getTokens(counts);
//     console.log(imgs);
//     setImgs(imgs);
//     setStatus(status);
//   }

//   const onMintPressed = async () => {
//     const { status } = await mintNFT();
//     setStatus(status);
//   };

//   const onUpgrade = async (tokenId) => {
//     const { status } = await upgrade(tokenId);
//     setStatus(status);
//   }

//   const onCheat = async (tokenId) => {
//     const { status } = await cheat(tokenId);
//     setStatus(status);
//   }

//   return (
//     <div className="Minter">
//       <button id="walletButton" onClick={connectWalletPressed}>
//         {walletAddress.length > 0 ? (
//           "Connected: " +
//           String(walletAddress)
//         ) : (
//           <span>Connect Wallet</span>
//         )}
//       </button>
//       <p>Tokens Count:{counts}</p>
//       <br></br>
//       <h1 id="title">🧙‍♂️ Alchemy NFT Minter</h1>
//       {imgs.map((e, i) => {
//         return <div key={i}>
//           <iframe src={e.image} 
//           allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
//           frameBorder="0" height="100%" sandbox="allow-scripts"
//           width="100%" style={{ "minHeight": "250px" }}></iframe>
//           <button onClick={() => { onUpgrade(e.tokenId) }}>
//             upgrade
//           </button>
//           <button onClick={() => { onCheat(e.tokenId) }}>
//             cheat
//           </button>
//         </div>
//       })}
//       <button id="mintButton" onClick={onMintPressed}>
//         Mint NFT
//       </button>
//       <button id="mintButton" onClick={fetchMetedata}>
//         Fetch Data
//       </button>
//       <p id="status">
//         {status}
//       </p>
//     </div>
//   );
// };

// export default Minter;
