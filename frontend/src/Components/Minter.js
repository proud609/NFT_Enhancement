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
        data.map((weapon, i) => {
          return (
            <Spin spinning={refreshing} key={i}>
              <ProCard split="vertical" bordered>
                <ProCard colSpan="33%">
                  <iframe src={weapon.animation_url}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    frameBorder="0" sandbox="allow-scripts"
                    style={{ "minHeight": "500px", "width": "400px" }}>
                  </iframe>
                </ProCard>
                <ProCard title={<Title>{weapon.name}</Title>} headerBordered>
                  <Card type='inner' title="Description">
                    {weapon.description}
                  </Card>
                  <Card type='inner' title="Token ID">
                    {weapon.tokenId}
                  </Card>
                  {weapon.attributes.map((attribute, i) => {
                    return (
                      <Card type='inner' title={attribute.trait_type} key={i}>
                        {attribute.value}
                      </Card>)
                  })}
                  <br />
                  <Row>
                    <Col span={4} >
                      <Button type="primary" size="large" shape="round" onClick={() => onUpgrade(weapon.tokenId)}>upgrade</Button>
                    </Col>
                    <Col span={4} >
                      <Button type="primary" size="large" shape="round" onClick={() => onRefresh(weapon.tokenId, i)}>refresh</Button>
                    </Col>
                    <Col span={4} >
                      <Button type="primary" size="large" shape="round" onClick={() => onCheat(weapon.tokenId)} disabled={!isOwner}>cheat</Button>
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