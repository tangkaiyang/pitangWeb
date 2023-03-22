// import { Modal, Input, Button, Form } from 'antd';
// import React, { useState } from 'react';

// const EnvironmentModal = ({ title, open, onCancel, onOk }) => {
//   const [name, setName] = useState('');
//   const [remark, setRemark] = useState('');

//   const handleNameChange = (e) => {
//     setName(e.target.value);
//   };

//   const handleRemarkChange = (e) => {
//     setRemark(e.target.value);
//   };

//   return (
//     <Modal
//       destroyOnClose
//       title={title}
//       open={open}
//       onCancel={onCancel}
//       onOk={() => onOk({ name, remark })}
//     >
//       <Form>
//         <Input title="环境名称" placeholder="请输入" value={name} onChange={handleNameChange} />
//         <Input.TextArea
//           title="备注"
//           placeholder="请输入"
//           value={remark}
//           onChange={handleRemarkChange}
//           style={{ marginTop: 12 }}
//         />
//       </Form>
//     </Modal>
//   );
// };

// export default EnvironmentModal;
import { Form, Input, Button, Modal } from 'antd';
import React from 'react';

const EnvironmentModal = ({ title, open, onCancel, onOk }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values);
      form.resetFields();
    });
  };

  return (
    <Modal title={title} open={open} onCancel={onCancel} onOk={handleOk}>
      <Form form={form}>
        <Form.Item
          name="name"
          label="环境名称"
          labelCol={{ span: 4, offset: 2 }}
          wrapperCol={{ span: 14 }}
          rules={[{ required: true, message: '请输入环境名称' }]}
        >
          <Input placeholder="请输入环境名称" />
        </Form.Item>
        <Form.Item
          name="remarks"
          label="备注"
          labelCol={{ span: 4, offset: 2 }}
          wrapperCol={{ span: 14 }}
        >
          <Input.TextArea placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EnvironmentModal;
