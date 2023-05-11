import { useEffect, useMemo, useState } from 'react';
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
  Switch,
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
import CodeEditor from '@/components/Postman/CodeEditor';

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
  const [loading, setLoading] = useState(true);

  const keyTypes = {
    0: 'String',
    1: 'Json',
    2: 'Yaml',
  };
  useEffect(() => {
    async function fetchUsers() {
      try {
        const resUsers = await listUsers();
        setUsers(resUsers);
      } catch (error) {
        message.error('获取用户失败');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchEnvs() {
      try {
        const response = await listEnvironments();
        setEnvs(response.data);
      } catch (error) {
        message.error('获取环境列表失败');
      } finally {
        setLoading(false);
      }
    }
    fetchEnvs();
  }, []);

  const fetchVariables = async () => {
    try {
      const response = await listGlobalConfigs(searchText);
      setVariables(response.data);
    } catch (error) {
      message.error('获取全局变量失败');
    }
  };
  useEffect(() => {
    if (!loading) {
      // 确保已经获取到用户和环境信息后再获取全局变量
      fetchVariables();
    }
  }, [searchText, loading]);

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
    const values = await form.validateFields();
    const newVariable = {
      ...editingVariable,
      ...values,
    };
    try {
      if (editingVariable) {
        await updateGlobalConfig({ id: editingVariable.id, ...newVariable });
      } else {
        await addGlobalConfig(newVariable);
      }
      setModalVisible(false);
      fetchVariables();
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleDeleteVariable = async (variable) => {
    try {
      await deleteGlobalConfig(variable.id);
      fetchVariables();
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSearch = async (value) => {
    setSearchText(value);
  };
  const getNameByEnvId = useMemo(
    () => (env_id) => {
      const env = envs.find((env) => env.id === env_id);
      // 异步,容错处理
      return env ? env.name : '';
    },
    [envs],
  );
  const getNameByUserId = useMemo(
    () => (user_id) => {
      console.log(user_id);
      console.log(users);
      const user = users.find((user) => user.id === user_id);
      // 异步,容错处理
      return user ? user.name : '';
    },
    [users],
  );

  const columns = useMemo(
    () => [
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
        render: (text, record) => (
          <Switch
            checked={text}
            onChange={(checked) =>
              updateGlobalConfig({ id: record.id, enable: checked ? 1 : 0 }).then(() => {
                // 成功更新后刷新全局变量列表
                fetchVariables();
              })
            }
          />
        ),
      },
      {
        title: '创建人',
        dataIndex: 'create_user',
        render: (text) => getNameByUserId(text),
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
    ],
    [getNameByEnvId, getNameByUserId, keyTypes, handleDeleteVariable, handleEditVariable],
  );

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
          <Form form={form} initialValues={{ enable: true }} labelCol={{ span: 4 }}>
            <Form.Item name="env_id" label="环境" rules={[{ required: true }]}>
              <Select>
                {envs.map(({ id, name }) => (
                  <Option key={id} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="key_type" label="类型" rules={[{ required: true }]}>
              <Select>
                {Object.entries(keyTypes).map(([value, label]) => (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="key" label="Key" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="value" label="Value" rules={[{ required: true }]}>
              <CodeEditor
                language={() => {
                  keyTypes(value);
                }}
                theme="vs-dark"
                height={250}
                options={{ lineNumbers: 'off' }}
              />
            </Form.Item>
            <Form.Item name="enable" label="是否启用" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default GlobalVariables;
