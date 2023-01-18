import React, { useState } from 'react';
import {
  Card,
  Col,
  Row,
  Input,
  Select,
  Button,
  Tabs,
  Radio,
  Menu,
  Dropdown,
  notification,
  Modal,
  Table,
} from 'antd';
import { SendOutlined, DownOutlined } from '@ant-design/icons';
import EditableTable from '@/components/Table/EditableTable';
import CodeEditor from './CodeEditor';
import { httpRequest } from '@/services/request';
import { Field } from 'rc-field-form';

// Col把栅格分成24份
const { Option } = Select;

export default () => {
  // bodyType是变量名,setBodyType是改变bodyType的方法,none是bodyType默认值
  const [bodyType, setBodyType] = useState('none');
  const [rawType, setRawType] = useState('JSON');
  // useState(初始值而不是变量名)
  // params相关变量
  const [paramsData, setParamsData] = useState([]);
  const [editableKeys, setEditableRowKeys] = useState(() => {
    paramsData.map((item) => item.id);
  });
  // headers相关变量
  const [headers, setHeaders] = useState([]);
  const [headersKeys, setHeadersKeys] = useState(() => headers.map((item) => item.id));

  const onClickMenu = (key) => {
    setRawType(key);
  };

  // 请求url+params
  const [url, setUrl] = useState('');

  // 根据paramsData拼接url
  const joinUrl = (data) => {
    let tempUrl = url.split('?')[0];
    data.forEach((item, idx) => {
      // 如果item.key有效
      if (item.key) {
        if (idx === 0) {
          tempUrl = `${tempUrl}?${item.key}=${item.value || ''}`;
        } else {
          tempUrl = `${tempUrl}&${item.key}=${item.value || ''}`;
        }
      }
    });
    setUrl(tempUrl);
  };

  const splitUrl = (nowUrl) => {
    const split = nowUrl.split('?');
    if (split.length < 2) {
      setParamsData([]);
    } else {
      const params = split[1].split('&');
      const newParams = [];
      const keys = [];
      params.forEach((item, idx) => {
        const [key, value] = item.split('=');
        const now = Date.now();
        keys.push(now + idx + 10);
        newParams.push({ key, value, id: now + idx + 10, description: '' });
      });
      setParamsData(newParams);
      setEditableRowKeys(keys);
    }
  };

  // 删除参数
  const onDelete = (columnType, key) => {
    if (columnType === `params`) {
      const data = paramsData.filter((item) => item.id !== key);
      setParamsData(data);
      // 更新url
      joinUrl(data);
    } else {
      // 更新headers
      const data = headers.filter((item) => item.id !== key);
      setHeaders(data);
    }
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

  const columns = (columnType) => {
    return [
      {
        title: 'KEY',
        dataIndex: 'key',
      },
      {
        title: 'VALUE',
        dataIndex: 'value',
      },
      {
        title: 'DESCRIPTION',
        dataIndex: 'description',
      },
      {
        title: '操作',
        valueType: 'option',
        width: 200,
        render: (text, record) => [
          <a
            key="delete"
            onClick={() => {
              onDelete(columnType, record.id);
            }}
          >
            删除
          </a>,
        ],
      },
    ];
  };
  // 处理headers,转成map
  const getHeaders = () => {
    const result = {};
    headers.forEach((item) => {
      if (item.key !== '') {
        result[item.key] = item.value;
      }
    });
    return result;
  };
  // 请求方法select框改为受控
  const [method, setMethod] = useState('GET');

  const selectBefore = (
    <Select value={method} onChange={(data) => setMethod(data)} className="select-before">
      <Option value="GET">GET</Option>
      <Option value="POST">POST</Option>
    </Select>
  );
  const [body, setBody] = useState(null);
  // 请求的loading状态
  const [loading, setLoading] = useState(false);
  // 返回值
  const [response, setResponse] = useState({});
  // 拼接request请求
  const onRequest = async () => {
    if (url === '') {
      notification.error({ message: '请求url不能为空' });
    }
    setLoading(true);
    const params = {
      method,
      url,
      body,
      headers: getHeaders(),
    };

    if (bodyType === null) {
      params.body = null;
    }
    const res = await httpRequest(params);
    setLoading(false);
    if (res.code !== 0) {
      notification.error(res.data.msg || '网络开小差了');
      return;
    }
    setResponse(res.data);
    Modal.info({
      title: '返回结果',
      content: (
        <pre>
          {typeof res.data.response === 'string'
            ? res.data.response
            : JSON.stringify(res.data.response, null, 2)}
        </pre>
      ),
    });
  };

  // http状态码组件
  const STATUS = {
    200: { color: '#67C23A', text: 'OK' },
    401: { color: '#F56C6C', text: 'unauthorized' },
  };

  const tabExtra = (response) => {
    return response ? (
      <div style={{ marginRight: 16 }}>
        <span>
          Status:
          <span
            style={{ color: STATUS[response.status_code].color, marginLeft: 8, marginRight: 8 }}
          >
            {response.status_code} {STATUS[response.status_code].text}
          </span>
          <span style={{ marginLeft: 8, marginRight: 8 }}>
            Time: <span style={{ color: '#67C23A' }}>{response.elapsed}</span>
          </span>
        </span>
      </div>
    ) : null;
  };

  const resColumns = [
    { title: 'KEY', dataIndex: 'key', key: 'key' },
    { title: 'VALUE', dataIndex: 'value', key: 'value' },
  ];

  const toTable = (field) => {
    if (!response[field]) {
      return [];
    }
    return Object.keys(response[field]).map((key) => ({ key, value: response[field][key] }));
  };

  return (
    <Card>
      <Row gutter={[8, 8]}>
        <Col span={18}>
          <Input
            size="large"
            addonBefore={selectBefore}
            placeholder="请输入要请求的url"
            // 绑定值才能更新QAQ
            value={url}
            // defaultValue={() => "http://baidu.com?a=1&b=2"}
            // 用标签的值更新
            onChange={(e) => {
              setUrl(e.target.value);
              splitUrl(e.target.value);
            }}
          />
        </Col>
        <Col span={6}>
          <Button
            onClick={onRequest}
            loading={loading}
            type="primary"
            size="large"
            style={{ marginRight: 16, float: 'right' }}
          >
            <SendOutlined />
            Send
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: 8 }} gutter={[18, 8]}>
        <Col>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: `Params`,
                key: '1',
                children: (
                  <EditableTable
                    columns={columns(`params`)}
                    title="Query Params"
                    dataSource={paramsData}
                    setDataSource={setParamsData}
                    extra={joinUrl}
                    editableKeys={editableKeys}
                    setEditableRowKeys={setEditableRowKeys}
                  />
                ),
              },
              {
                label: `Headers`,
                key: '2',
                children: (
                  <EditableTable
                    columns={columns('headers')}
                    title="Headers"
                    dataSource={headers}
                    setDataSource={setHeaders}
                    editableKeys={headersKeys}
                    setEditableRowKeys={setHeadersKeys}
                  />
                ),
              },
              {
                label: `Body`,
                key: '3',
                children: (
                  <>
                    <Row>
                      <Radio.Group value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
                        <Radio value="none">none</Radio>
                        <Radio value="form-data">form-data</Radio>
                        <Radio value="x-www-form-urlencoded">x-www-form-urlencoded</Radio>
                        <Radio value="raw">raw</Radio>
                        <Radio value="binary">binary</Radio>
                        <Radio value="GraphQL">GraphQL</Radio>
                      </Radio.Group>
                      {bodyType === 'raw' ? (
                        <Dropdown style={{ marginLeft: 8 }} overlay={menu} trigger={['click']}>
                          <a onClick={(e) => e.preventDefault()}>
                            {rawType} <DownOutlined />
                          </a>
                        </Dropdown>
                      ) : null}
                    </Row>
                    {bodyType !== 'none' ? (
                      <Row style={{ marginTop: 12 }}>
                        <Col span={24}>
                          <Card bodyStyle={{ padding: 0 }}>
                            {/* 注意入参!!! */}
                            <CodeEditor value={body} setValue={setBody} height="20vh" />
                          </Card>
                        </Col>
                      </Row>
                    ) : (
                      <div style={{ height: '20vh', lineHeight: '20vh', textAlign: 'center' }}>
                        This request does not have a body
                      </div>
                    )}
                  </>
                ),
              },
            ]}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        {Object.keys(response).length === 0 ? null : (
          <Tabs
            style={{ width: '100%' }}
            tabBarExtraContent={tabExtra(response)}
            items={[
              {
                label: 'Body',
                key: '1',
                children: (
                  <CodeEditor
                    value={response.response ? JSON.stringify(response.response, null, 2) : ''}
                    height="30vh"
                  />
                ),
              },
              {
                label: 'Cookie',
                key: '2',
                children: (
                  <Table
                    columns={resColumns}
                    dataSource={toTable('cookies')}
                    size="small"
                    pagination={false}
                  />
                ),
              },
              {
                label: 'Headers',
                key: '3',
                children: (
                  <Table
                    columns={resColumns}
                    dataSource={toTable('response_header')}
                    size="small"
                    pagination={false}
                  />
                ),
              },
            ]}
          />
        )}
      </Row>
    </Card>
  );
};
