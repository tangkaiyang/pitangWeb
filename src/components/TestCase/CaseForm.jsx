import React from 'react';
import { Badge, Row, Select } from 'antd';
import { CONFIG } from '@/consts/config';
import CommonForm from '@/components/Drawer/CommonForm';

const { Option } = Select;

export default ({ data, modal, setModal, onFinish }) => {
  const fields = [
    {
      name: 'catalogue',
      label: '用例目录',
      required: true,
      message: '请输入用例目录',
      type: 'input',
      placeholder: '请输入用例目录',
      component: null,
      span: 12,
    },
    {
      name: 'name',
      label: '用例名称',
      required: true,
      message: '请输入用例名称',
      type: 'input',
      placeholder: '请输入用例名称',
      component: null,
      span: 12,
    },
    {
      name: 'priority',
      label: '用例优先级',
      required: true,
      component: (
        <Select>
          {CONFIG.PRIORITY.map((v) => (
            <Option value={v}>{v}</Option>
          ))}
        </Select>
      ),
      type: 'select',
      span: 12,
    },
    {
      name: 'status',
      label: '用例状态',
      required: true,
      component: (
        <Select>
          {Object.keys(CONFIG.CASE_STATUS).map((key) => (
            <Option key={key} value={key}>
              {<Badge {...CONFIG.CASE_BADGE[key]} />}
            </Option>
          ))}
        </Select>
      ),
      type: 'select',
      span: 12,
    },
    {
      name: 'request_type',
      label: '请求类型',
      required: true,
      component: (
        <Select>
          {Object.keys(CONFIG.REQUEST_TYPE).map((key) => (
            <Option key={key} value={key} disabled={key !== '1'}>
              {CONFIG.REQUEST_TYPE[key]}
            </Option>
          ))}
        </Select>
      ),
      type: 'select',
      span: 12,
    },
    {
      name: 'tag',
      label: '用例标签',
      required: false,
      component: <Select mode="tags" placeholder="请输入用例标签"></Select>,
      type: 'select',
      span: 12,
    },
  ];

  return (
    <Row gutter={[8, 8]}>
      <CommonForm
        title="新增接口测试用例"
        left={6}
        right={18}
        width={800}
        record={data}
        onFinish={onFinish}
        fields={fields}
        onCancel={() => setModal(false)}
        visible={modal}
      />
    </Row>
  );
};
