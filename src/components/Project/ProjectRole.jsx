import { CONFIG } from '@/consts/config';
import { insertProjectRole, updateProjectRole } from '@/services/project';
import { DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Popconfirm, Select, Skeleton, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import FormForModal from '../PitangForm/FormForModal';

const { Option } = Select;

const ProjectRole = ({ project, roles, users, fetchData }) => {
  const params = useParams();
  const [modal, setModal] = useState(false);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    const temp = {};
    users.forEach((item) => {
      temp[item.id] = item;
    });
    setUserMap(temp);
  }, []);

  const onUpdateRole = async (item, value) => {
    const data = {
      ...item,
      project_role: value,
    };
    const res = await updateProjectRole(data);
    if (auth.response(res, true)) {
      await fetchData();
    }
  };
  const onFinish = async (values) => {
    const info = {
      ...values,
      project_id: params.id,
    };
    const res = await insertProjectRole(info);
    if (auth.response(res, true)) {
      setModal(false);
      // 重新加载权限
      await fetchData();
    }
  };
  // todo 删除角色
  const confirm = (item) => {};

  const permission = (item) => {
    if (item.project_role === 'OWNER') {
      return [
        <Tag key={item.id} color="blue" size="large">
          负责人
        </Tag>,
      ];
    }
    return [
      <Select
        key={item.id}
        style={{ width: 80 }}
        value={CONFIG.PROJECT_ROLE_MAP[item.project_role]}
        onChange={(data) => {
          onUpdateRole(item, data);
        }}
      >
        {object.keys(CONFIG.PROJECT_ROLE_MAP).map((key) => (
          <Option key={key} value={key}>
            {CONFIG.PROJECT_ROLE_MAP[key]}
          </Option>
        ))}
      </Select>,
      <Popconfirm
        key={item.id}
        title="确定要删除该角色吗?"
        onConfirm={() => {
          confirm(item);
        }}
        okText="确定"
        cancelText="取消"
      >
        <DeleteTwoTone twoToneColor="red" style={{ cursor: 'pointer' }} />
      </Popconfirm>,
    ];
  };
  const opt = (
    <Select placeholder="请选择用户">
      {users.map((item) => (
        <Option value={item.id} key={item.id} disabled={item.id === project.owner}>
          {item.name}
        </Option>
      ))}
    </Select>
  );

  const roleList = (
    <Select placeholder="请选择角色">
      {Object.keys(CONFIG.PROJECT_ROLE_MAP).map((key) => (
        <Option key={key} value={key}>
          {CONFIG.PROJECT_ROLE_MAP[key]}
        </Option>
      ))}
    </Select>
  );

  const fields = [
    {
      name: 'user_id',
      label: '用户',
      required: true,
      component: opt,
      type: 'select',
    },
    {
      name: 'project_role',
      label: '角色',
      required: true,
      component: roleList,
      type: 'select',
    },
  ];
  const data = [
    {
      user_id: project.owner,
      project_role: 'OWNER',
    },
    ...roles,
  ];
  return (
    <div>
      <FormForModal
        title="添加成员"
        left={6}
        right={18}
        width={500}
        record={{}}
        onFinish={onFinish}
        fields={fields}
        onCancel={() => {
          setModal(false);
        }}
        visible={modal}
      />
      <div style={{ marginBottom: 16 }}>
        <Button size="small" type="primary" onClick={() => setModal(true)}>
          <PlusOutlined />
          添加成员
        </Button>
      </div>
      <div>
        <List
          itemLayout="horizontal"
          size="small"
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={permission(item)}>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={userMap[item.user_id] ? userMap[item.user_id].name : 'loading'}
                  description={userMap[item.user_id] ? userMap[item.user_id].email : 'loading'}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ProjectRole;
