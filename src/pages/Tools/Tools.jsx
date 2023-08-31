import React, { useState } from 'react';
import { Row, Col, Dropdown, Menu, Input, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

const { TextArea } = Input;

export default () => {
  const [ltype, setLtype] = useState('JSON');
  const [rtype, setRtype] = useState('JSON');

  const handleMenuClick = (e, setType) => {
    setType(e.key);
  };

  const menu = (setType) => (
    <Menu onClick={(e) => handleMenuClick(e, setType)}>
      <Menu.Item key="YAML">YAML</Menu.Item>
      <Menu.Item key="JSON">JSON</Menu.Item>
      <Menu.Item key="XML">XML</Menu.Item>
    </Menu>
  );

  return (
    <PageContainer title={false}>
      <Row gutter={[8, 8]} style={{ position: 'relative' }}>
        <Col span={12}>
          <div style={{ position: 'absolute', top: 0, right: 10, zIndex: 1000 }}>
            <Dropdown overlay={menu(setLtype)} placement="bottomRight">
              <a>
                <Space>{ltype}</Space>
              </a>
            </Dropdown>
          </div>
          <TextArea rows={4} style={{ height: '100vh' }} />
        </Col>
        <Col span={12}>
          <div style={{ position: 'absolute', top: 0, right: 10, zIndex: 1000 }}>
            <Dropdown overlay={menu(setRtype)} placement="bottomRight">
              <a>
                <Space>{rtype}</Space>
              </a>
            </Dropdown>
          </div>
          <TextArea rows={4} style={{ height: '100vh' }} />
        </Col>
      </Row>
    </PageContainer>
  );
};
