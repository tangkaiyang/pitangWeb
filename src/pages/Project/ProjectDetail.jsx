import { queryProject } from '@/services/project';
import auth from '@/utils/auth';
import { process } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'umi';

export default () => {
  const params = useParams();
  const projectId = params.id;
  const [projectData, setProjectData] = useState({});
  const [roles, setRoles] = useState([]);

  const fetchData = async () => {
    const res = await queryProject({ projectId });
    if (auth.response(res)) {
      setProjectData(res.data.project);
      setRoles(res.data.role);
    }
  };

  useEffect(async () => {
    await process(fetchData);
  }, []);

  return (
    <PageContainer>
      <Card></Card>
    </PageContainer>
  );
};
