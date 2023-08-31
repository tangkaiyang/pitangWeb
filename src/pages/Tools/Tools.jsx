import React, { useState, useEffect } from 'react';
import { Row, Col, Dropdown, Menu, Input, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

const { TextArea } = Input;

const formatText = (data, type) => {
  if (Array.isArray(data)) {
    return data.map((item) => formatText(item, type));
  } else if (typeof data === 'object') {
    const formattedObject = {};
    for (const key in data) {
      formattedObject[key] = formatText(data[key], type);
    }
    return formattedObject;
  } else {
    if (type === 'JSON') {
      return JSON.stringify(data);
    } else if (type === 'YAML') {
      return `YAML: ${data}`;
    } else if (type === 'XML') {
      return `<XML>${data}</XML>`;
    }
    return data;
  }
};

export default () => {
  const [ltype, setLtype] = useState('JSON');
  const [rtype, setRtype] = useState('JSON');
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');

  const menu = (
    <Menu>
      <Menu.Item key="YAML">YAML</Menu.Item>
      <Menu.Item key="JSON">JSON</Menu.Item>
      <Menu.Item key="XML">XML</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    try {
      const parsedLeftText = JSON.parse(leftText);
      setRightText(JSON.stringify(formatText(parsedLeftText, rtype)));
    } catch (error) {
      // Handle error
    }
  }, [leftText, rtype]);

  return (
    <PageContainer title={false}>
      <Row gutter={[8, 8]} style={{ position: 'relative' }}>
        <Col span={12}>
          <div style={{ position: 'absolute', top: 0, right: 10, zIndex: 1000 }}>
            <Dropdown overlay={menu} placement="bottomRight">
              <a onClick={(e) => setLtype(e.key)}>
                <Space>{ltype}</Space>
              </a>
            </Dropdown>
          </div>
          <TextArea
            rows={4}
            style={{ height: '100vh' }}
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
          />
        </Col>
        <Col span={12}>
          <div style={{ position: 'absolute', top: 0, right: 10, zIndex: 1000 }}>
            <Dropdown overlay={menu} placement="bottomRight">
              <a onClick={(e) => setRtype(e.key)}>
                <Space>{rtype}</Space>
              </a>
            </Dropdown>
          </div>
          <TextArea rows={4} style={{ height: '100vh' }} value={rightText} readOnly />
        </Col>
      </Row>
    </PageContainer>
  );
};
