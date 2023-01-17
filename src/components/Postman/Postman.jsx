import React, { useState } from 'react';
import { Card, Col, Row, Input, Select, Button, Tabs, Radio, Menu, Dropdown } from 'antd';
import { SendOutlined, DownOutlined } from '@ant-design/icons';
import EditableTable from '@/components/Table/EditableTable';

// Col把栅格分成24份
const { Option } = Select;
const selectBefore = (
  <Select defaultValue="GET" className="select-before">
    <Option value="GET">GET</Option>
    <Option value="POST">POST</Option>
  </Select>
);
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
          <Button type="primary" size="large" style={{ marginRight: 16, float: 'right' }}>
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
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </Card>
  );
};
