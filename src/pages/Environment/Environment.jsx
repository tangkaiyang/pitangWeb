import {
  addEnvironment,
  deleteEnvironment,
  listEnvironments,
  updateEnvironment,
} from '@/services/environment';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Input, Button, Table, Row, Col, Card } from 'antd';
import React, { useState, useEffect } from 'react';
import EnvironmentModal from './EnvironmentModal';

export default () => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [recordId, setRecordId] = useState();

  const fetchData = async () => {
    const result = await listEnvironments(searchText);
    setData(result.data);
  };
  useEffect(() => {
    fetchData();
  }, [searchText]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleAdd = async () => {
    setTitle('新增环境');
    setVisible(true);
  };
  const handleUpdate = async () => {
    setTitle('编辑环境');
    setVisible(true);
  };
  const handleDelete = async (id) => {
    await deleteEnvironment(id);
    await fetchData();
  };

  const onOk = async (values) => {
    if (title === '新增环境') {
      addEnvironment(values);
    }
    if (title === '编辑环境') {
      values.id = recordId;
      updateEnvironment(values);
    }
    setVisible(false);
    await fetchData();
  };

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: '环境名称',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      width: '40%',
    },
    {
      title: '操作',
      render: (record) => (
        <>
          <a
            onClick={() => {
              setRecordId(record.id);
              handleUpdate(record);
            }}
          >
            编辑
          </a>
          <a
            onClick={() => {
              handleDelete(record.id);
            }}
          >
            &nbsp;删除
          </a>
        </>
      ),
      width: '20%',
    },
  ];

  return (
    <PageContainer title={false}>
      <Card>
        <Row justify="space-between" align="middle" gutter={[18, 6]}>
          <Col>
            <Button type="primary" onClick={handleAdd}>
              <PlusOutlined />
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
        <EnvironmentModal
          title={title}
          open={visible}
          onCancel={() => {
            setVisible(false);
          }}
          onOk={onOk}
        />
      </Card>
    </PageContainer>
  );
};
