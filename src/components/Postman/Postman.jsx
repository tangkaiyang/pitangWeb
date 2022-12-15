import React, { useState } from 'react';
import { Card, Col, Row, Input, Select, Button, Tabs, Radio, Menu } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

export default () => {
  // Col把栅格分成24份
  const { Option } = Select;
  const selectBefore = (
    <Select defaultValue="GET" className="select-before">
      <Option value="GET">GET</Option>
      <Option value="POST">POST</Option>
    </Select>
  );

  const onClickMenu = (key) => {
    setRawType(key);
  };

  const menu = (
    <Menu>
      <Menu.Item key="Text">
        <a
          onClick={() => {
            onClickMenu('Text');
          }}
        >
          Text
        </a>
      </Menu.Item>
      <Menu.Item key="JavaScript">
        <a
          onClick={() => {
            onClickMenu('JavaScript');
          }}
        >
          JavaScript
        </a>
      </Menu.Item>
      <Menu.Item key="JSON">
        <a
          onClick={() => {
            onClickMenu('JSON');
          }}
        >
          JSON
        </a>
      </Menu.Item>
      <Menu.Item key="HTML">
        <a
          onClick={() => {
            onClickMenu('HTML');
          }}
        >
          HTML
        </a>
      </Menu.Item>
      <Menu.Item key="XML">
        <a
          onClick={() => {
            onClickMenu('XML');
          }}
        >
          XML
        </a>
      </Menu.Item>
    </Menu>
  );
  // bodyType是变量名,setBodyType是改变bodyType的方法,none是bodyType默认值
  const [bodyType, setBodyType] = useState('none');
  const [rawType, setRawType] = useState('JSON');

  return (
    <Card>
      <Row gutter={[8, 8]}>
        <Col span={18}>
          <Input size="large" addonBefore={selectBefore} defaultValue="mysite" />
        </Col>
        <Col span={6}>
          <Button type="primary" size="large" style={{ marginRight: 16, float: 'right' }}>
            <SendOutlined />
            Send
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: 8 }}>
        <Tabs
          defaultActiveKey="1"
          // onChange={onChange}
          items={[
            {
              label: `Params`,
              key: '1',
              children: `这是Params`,
            },
            {
              label: `Headers`,
              key: '2',
              children: `这是Headers`,
            },
            {
              label: `Body`,
              key: '3',
              children: (
                <Radio.Group value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
                  <Radio value="none">none</Radio>
                  <Radio value="form-data">form-data</Radio>
                  <Radio value="x-www-form-urlencoded">x-www-form-urlencoded</Radio>
                  <Radio value="raw">raw</Radio>
                  <Radio value="binary">binary</Radio>
                  <Radio value="GraphQL">GraphQL</Radio>
                </Radio.Group>
              ),
            },
          ]}
        />
        {bodyType === 'raw' ? (
          <Dropdown style={{ marginLeft: 8 }} overlay={menu} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              {rawType} <DownOutlined />
            </a>
          </Dropdown>
        ) : null}
      </Row>
    </Card>
  );
};
