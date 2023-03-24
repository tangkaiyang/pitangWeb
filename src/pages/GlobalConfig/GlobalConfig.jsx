import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  listGlobalConfigs,
  addGlobalConfig,
  updateGlobalConfig,
  deleteGlobalConfig,
} from '@/services/global_config';
import { PageContainer } from '@ant-design/pro-layout';
import { listUsers } from '@/services/user';
import { listEnvironments } from '@/services/environment';

const { Option } = Select;
const { Search } = Input;

const GlobalVariables = () => {
  const [variables, setVariables] = useState([]);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVariable, setEditingVariable] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [envs, setEnvs] = useState([]);

  const keyTypes = {
    0: 'String',
    1: 'Json',
    2: 'Yaml',
  };

  useEffect(() => {
    fetchVariables();
  }, [searchText]);

  const fetchVariables = async () => {
    try {
      const response = await listGlobalConfigs(searchText);
      setVariables(response.data);
    } catch (error) {
      message.error('获取全局变量失败');
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await listUsers();
      setUsers(response.data);
    } catch (error) {
      message.error('获取用户失败');
    }
  };
  useEffect(() => {
    fetchEnvs();
  }, []);

  const fetchEnvs = async () => {
    try {
      const response = await listEnvironments();
      setEnvs(response.data);
    } catch (error) {
      message.error('获取环境列表失败');
    }
  };
  const handleAddVariable = () => {
    setEditingVariable(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditVariable = (variable) => {
    setEditingVariable(variable);
    form.setFieldsValue(variable);
    setModalVisible(true);
  };

  const handleSaveVariable = async () => {
    try {
      const values = await form.validateFields();
      const newVariable = {
        ...editingVariable,
        ...values,
      };
      if (editingVariable) {
        await updateGlobalConfig(editingVariable.id, newVariable);
      } else {
        await addGlobalConfig(newVariable);
      }
      setModalVisible(false);
      fetchVariables();
      message.success('Global variable saved successfully.');
    } catch (error) {
      message.error('Failed to save global variable.');
    }
  };

  const handleDeleteVariable = async (variable) => {
    try {
      await deleteGlobalConfig(variable.id);
      fetchVariables();
      message.success('Global variable deleted successfully.');
    } catch (error) {
      message.error('Failed to delete global variable.');
    }
  };

  const handleSearch = async (value) => {
    setSearchText(value);
  };

  // 根据env_id获取name
  const getNameByEnvId = (env_id) => {
    console.log(env_id);
    console.log(envs);
    const env = envs.find((env) => env.id === env_id);
    console.log(env);
    // return env.name;
  };

  const columns = [
    {
      title: '环境',
      dataIndex: 'env_id',
      render: (text) => (
        <Tag color="grey" key={text}>
          {getNameByEnvId(text)}
        </Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'key_type',
      render: (text) => (
        <Tag color="green" key={text}>
          {keyTypes[text]}
        </Tag>
      ),
    },
    {
      title: 'key',
      dataIndex: 'key',
    },
    {
      title: 'value',
      dataIndex: 'value',
    },
    {
      title: '是否可用',
      dataIndex: 'enable',
    },
    {
      title: '创建人',
      dataIndex: 'create_user',
    },

    {
      title: '操作',
      render: (_, variable) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditVariable(variable)}>
            编辑
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() =>
              Modal.confirm({
                title: '确定删除?',
                onOk: () => handleDeleteVariable(variable),
              })
            }
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title={false}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddVariable}>
              新增全局变量
            </Button>
          </Col>
          <Col>
            <Search
              key="search"
              placeholder="请输入"
              allowClear
              onSearch={handleSearch}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
          </Col>
        </Row>
        <Table columns={columns} dataSource={variables} rowKey="id" />
        <Modal
          title={editingVariable ? '编辑全局变量' : '新增全局变量'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSaveVariable}
          destroyOnClose
        >
          <Form form={form} initialValues={{ enabled: true }}>
            <Form.Item name="env_id" label="环境" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="key_type" label="类型" rules={[{ required: true }]}>
              <Select>
                <Option value="0">String</Option>
                <Option value="1">Json</Option>
                <Option value="2">Yaml</Option>
              </Select>
            </Form.Item>
            <Form.Item name="key" label="Key" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="value" label="Value" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="enable" label="是否启用" valuePropName="checked">
              <Input type="checkbox" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default GlobalVariables;
