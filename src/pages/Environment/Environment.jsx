import { Input, Button, Table, Row, Col } from 'antd';
import React, { useState } from 'react';

export default () => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleAdd = () => {
    // TODO: Implement add functionality
  };

  const columns = [
    {
      title: '环境名称',
      dataIndex: 'name',
    },
    {
      title: '环境变量',
      dataIndex: 'variable',
    },
    {
      title: '操作',
      render: () => <a>编辑</a>,
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" gutter={[18, 6]}>
        <Col>
          <Button type="primary" onClick={handleAdd}>
            新增
          </Button>
        </Col>
        <Col>
          <Input.Search
            placeholder="搜索"
            allowClear
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }} gutter={[16, 16]}>
        <Col span={24}>
          <Table columns={columns} dataSource={data} />
        </Col>
      </Row>
    </>
  );
};
