import { queryProject } from '@/services/project';
import auth from '@/utils/auth';
import { process } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'umi';
import React from 'react';
import ProjectInfo from '@/components/Project/ProjectInfo';
import ProjectRole from '@/components/Project/ProjectRole';
import Directory from '@/components/TestCase/Directory';
import { listUsers } from '@/services/user';

export default () => {
  // 获取url参数
  const params = useParams();
  const projectId = params.id;
  const [projectData, setProjectData] = useState({});
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [tree, setTree] = useState([]);

  const fetchUsers = async () => {
    const res = await listUsers();
    setUsers(res.data);
  };

  const fetchData = async () => {
    await fetchUsers();
    const res = await queryProject({ projectId });
    if (auth.response(res)) {
      setProjectData(res.data.project);
      setRoles(res.data.roles);
      setTree(res.data.test_case);
    }
  };

  useEffect(async () => {
    await process(fetchData);
  }, []);

  return (
    <PageContainer
      title={
        <span>
          <Avatar style={{ backgroundColor: '#87d068' }}>
            {projectData.name === undefined ? 'loading...' : projectData.name.slice(0, 2)}
          </Avatar>
        </span>
      }
    >
      <Card>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: `用例列表`,
              key: '1',
              children: <Directory loading={false} treeData={tree} />,
            },
            {
              label: `成员列表`,
              key: '2',
              children: (
                <ProjectRole
                  users={users}
                  project={projectData}
                  roles={roles}
                  fetchData={fetchData}
                />
              ),
            },
            {
              label: `项目设置`,
              key: '3',
              children: <ProjectInfo data={projectData} users={users} reloadData={fetchData} />,
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
};
