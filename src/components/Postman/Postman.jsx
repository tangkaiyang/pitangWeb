import React from 'react';
import { Card, Col, Row, Input, Select, Button, TabPane, Tabs } from 'antd';
import { SendOutlined } from '@ant-design/icons';
// Col把栅格分成24份
const { Option } = Select;
const selectBefore = (
  <Select defaultValue="GET" className="select-before">
    <Option value="GET">GET</Option>
    <Option value="POST">POST</Option>
  </Select>
);
export default () => {
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
        <Tabs defaultActiveKey="1">
          <TabPane tab="Params" key="1">
            这是Params
          </TabPane>
          <TabPane tab="Headers" key="2">
            这是Headers
          </TabPane>
          <TabPane tab="Body" key="3">
            这是Body
          </TabPane>
        </Tabs>
      </Row>
    </Card>
  );
};
