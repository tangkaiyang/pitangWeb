import React, { useState } from 'react';
import { Card, Col, Row, Input, Select, Button, Tabs, Radio } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

// Col把栅格分成24份
const { Option } = Select;
const selectBefore = (
  <Select defaultValue="GET" className="select-before">
    <Option value="GET">GET</Option>
    <Option value="POST">POST</Option>
  </Select>
);

const items = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item (disabled)
      </a>
    ),
    icon: <SmileOutlined />,
    disabled: true,
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
];

export default () => {
  // bodyType是变量名,setBodyType是改变bodyType的方法,none是bodyType默认值
  const [bodyType, setBodyType] = useState('none');

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
          <Dropdown
            menu={{
              items,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Hover me
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        ) : null}
      </Row>
    </Card>
  );
};
