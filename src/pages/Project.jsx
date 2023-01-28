import auth from '@/utils/auth';
import { process } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-components';
import React, { PureComponent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { listProject, insertProject } from '@/services/project';
import { Button, Row, Select, Tooltip, Col, Input, Spin, Card, Empty, Popover, Avatar } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';
import { history } from 'umi';
import FormForModal from '@/components/PitangForm/FormForModal';
import { connect } from '@/.umi/plugin-dva/exports';
// const { Option } = Select;
// const { Search } = Input;

// export default () => {
//   // 项目数组
//   const [data, setData] = useState([
//     {
//       id: 1,
//       name: 'test',
//       owner: 1,
//       created_at: '2022-01-01 00:00:00',
//       updated_at: '2022-01-01 00:00:00',
//       deleted_at: null,
//       create_user: 1,
//       update_user: 1,
//       private: false,
//       description: '432545324532543532564353254353254test',
//     },
//   ]);
//   // 分页
//   const [pagination, setPagination] = useState({ current: 1, size: 8, total: 0 });
//   // 创建项目弹窗是否可见
//   const [visible, setVisible] = useState(false);
//   // 项目管理员
//   const [uses, setUsers] = useState({});

//   // 方法
//   // 获取数据
//   // useEffect在mount或view更新都会执行,因此会无限循环,故传第二参数[]仅在mount时执行
//   // [pagination]在pagination变化时更新
//   const fetchData = async (current = pagination.current, size = pagination.size) => {
//     await process(async () => {
//       const res = await listProject({ page: current, size });
//       if (auth.response(res)) {
//         setData(res.data);
//         setPagination({ ...pagination, total: res.total });
//       }
//     });
//   };
//   useEffect(() => {
//     async function fetchData(current = pagination.current, size = pagination.size) {
//       await process(async () => {
//         const res = await listProject({ page: current, size });
//         if (auth.response(res)) {
//           setData(res.data);
//           setPagination({ ...pagination, total: res.total });
//         }
//         return;
//       });
//     }
//     fetchData();
//   }, [pagination]);

//   // 项目搜索
//   const onSearchProject = async (projectName) => {
//     await process(async () => {
//       const res = await listProject({ page: 1, size: pagination.size, name: projectName });
//       if (auth.response(res)) {
//         setData(res.data);
//         setPagination({ ...pagination, current: 1, total: res.total });
//       }
//     });
//   };
//   // 新增项目
//   const onHandleCreate = async (values) => {
//     const res = await insertProject(values);
//     if (auth.response(res, true)) {
//       setVisible(false);
//       await fetchData(1);
//     }
//   };
//   const content = (item) => {
//     return (
//       <div>
//         {/* <p>负责人:{users[item.owner].name}</p> */}
//         <p>简介:{item.description || '无'}</p>
//         <p>更新时间:{item.updated_at}</p>
//       </div>
//     );
//   };
//   const users = [];
//   const opt = (
//     <Select placeholder="请选择项目负责人">
//       {Object.keys(users).map((id) => (
//         <Option key={id} value={id}>
//           {users[id].name}
//         </Option>
//       ))}
//     </Select>
//   );
//   const fields = [
//     {
//       name: 'projectName',
//       label: '项目名称',
//       required: true,
//       message: '请输入项目名称',
//       type: 'input',
//       placeholder: '请输入项目名称',
//     },
//     {
//       name: 'owner',
//       label: '负责人',
//       required: true,
//       component: opt,
//       type: 'select',
//     },
//     {
//       name: 'description',
//       label: '项目描述',
//       required: false,
//       message: '请输入项目描述',
//       type: 'textarea',
//       placeholder: '请输入项目描述',
//     },
//     {
//       name: 'private',
//       label: '是否私有',
//       required: true,
//       message: '请选择是否私有',
//       type: 'switch',
//       valuePropName: 'checked',
//     },
//   ];
//   return (
//     <PageContainer title={false}>
//       <FormForModal
//         width={600}
//         title="添加项目"
//         left={6}
//         right={18}
//         record={{}}
//         visible={visible}
//         onCancel={() => setVisible(false)}
//         fields={fields}
//         onFinish={onHandleCreate}
//       />
//       {/* 24等分 */}
//       <Row gutter={8} style={{ marginBottom: 16 }}>
//         <Col span={18}>
//           <Button type="primary" onClick={() => setVisible(true)}>
//             创建项目
//             <Tooltip title="只有超级管理员可以创建项目">
//               <QuestionOutlined />
//             </Tooltip>
//           </Button>
//         </Col>
//         <Col span={6}>
//           <Search
//             onSearch={onSearchProject}
//             style={{ float: 'right' }}
//             placeholder="请输入项目名称"
//           />
//         </Col>
//       </Row>
//       <Spin spinning={false}>
//         <Row gutter={16}>
//           {data.length === 0 ? (
//             <Col span={24} style={{ textAlign: 'center', marginBottom: 12 }}>
//               <Card>
//                 <Empty description="暂无项目,快点击「创建项目」创建一个吧!" />
//               </Card>
//             </Col>
//           ) : (
//             data.map((item) => (
//               <Col key={item.id} span={4} style={{ marginBottom: 12 }}>
//                 <Popover content={content(item)} placement="rightTop">
//                   <Card
//                     hoverable
//                     bordered={false}
//                     style={{ borderRadius: 16, textAlign: 'center' }}
//                     bodyStyle={{ padding: 16 }}
//                     onClick={() => {
//                       // ``中引用:${}
//                       history.push(`/project/${item.id}`);
//                     }}
//                   >
//                     <Avatar style={{ backgroundColor: '#87d068' }} size={64}>
//                       {item.name.slice(0, 2)}
//                     </Avatar>
//                     <p
//                       style={{
//                         textAlign: 'center',
//                         fontWeight: 'bold',
//                         fontSize: 18,
//                         marginTop: 8,
//                       }}
//                     >
//                       {item.name}
//                     </p>
//                   </Card>
//                 </Popover>
//               </Col>
//             ))
//           )}
//         </Row>
//       </Spin>
//     </PageContainer>
//   );
// };
import NProgress from 'nprogress';
const { Search } = Input;
const { Option } = Select;

@connect(({ project, loading, user }) => ({ project, loading, user }))
export default class Project extends PureComponent {
  async componentDidMount() {
    NProgress.start();
    await this.props.dispatch({ type: 'user/fetch' });
    await this.props.dispatch({ type: 'project/fetch', payload: { page: 1, size: 1000 } });
    NProgress.done();
  }
  onSearchProject = (projectName) => {
    this.props.dispatch({ type: 'project/fetch', payload: { page: 1, size: 1000, projectName } });
  };
  onHandleModal = (status) => {
    this.props.dispatch({ type: 'project/save', payload: { visible: status } });
  };
  onHandleCreate = (values) => {
    this.props.dispatch({ type: 'project/insert', payload: values });
  };
  render() {
    const { data, visible } = this.props.project;
    const { users, userMap } = this.props.user;
    const { loading } = this.props;
    const content = (item) => {
      return (
        <div>
          <p>负责人:{userMap[item.owner].nickname}</p>
          <p>简介:{item.description || '无'}</p>
          <p>更新时间:{item.updateTime}</p>
        </div>
      );
    };
    const opt = (
      <Select placeholder="请选择负责人">
        {users.map((item) => (
          <Option key={item.key} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    );
    const fields = [
      {
        name: 'projectName',
        label: '项目名称',
        required: true,
        message: '请输入项目名称',
        type: 'input',
        placeholder: '请输入项目名称',
      },
      {
        name: 'owner',
        label: '负责人',
        required: true,
        component: opt,
        type: 'select',
      },
      {
        name: 'description',
        label: '项目描述',
        required: false,
        message: '请输入项目描述',
        type: 'textarea',
        placeholder: '请输入项目描述',
      },
      {
        name: 'private',
        label: '是否私有',
        required: true,
        message: '请选择是否私有',
        type: 'switch',
        valuePropName: 'checked',
      },
    ];
    return (
      <PageContainer title={false}>
        <FormForModal
          width={600}
          title="添加项目"
          left={6}
          right={18}
          record={{}}
          visible={visible}
          onCancel={() => this.onHandleModal(false)}
          fields={fields}
          loading={loading.effects['project/insert']}
          onFinish={this.onHandleCreate}
        />
        {/* 24等分 */}
        <Row gutter={8} style={{ marginBottom: 16 }}>
          <Col span={18}>
            <Button type="primary" onClick={() => this.onHandleModal(true)}>
              创建项目
              <Tooltip title="只有超级管理员可以创建项目">
                <QuestionOutlined />
              </Tooltip>
            </Button>
          </Col>
          <Col span={6}>
            <Search
              onSearch={this.onSearchProject}
              style={{ float: 'right' }}
              placeholder="请输入项目名称"
            />
          </Col>
        </Row>
        <Spin spinning={false}>
          <Row gutter={16}>
            {data.length === 0 ? (
              <Col span={24} style={{ textAlign: 'center', marginBottom: 12 }}>
                <Card>
                  <Empty description="暂无项目,快点击「创建项目」创建一个吧!" />
                </Card>
              </Col>
            ) : (
              data.map((item) => (
                <Col key={item.id} span={4} style={{ marginBottom: 12 }}>
                  <Popover content={content(item)} placement="rightTop">
                    <Card
                      hoverable
                      bordered={false}
                      style={{ borderRadius: 16, textAlign: 'center' }}
                      bodyStyle={{ padding: 16 }}
                      onClick={() => {
                        // ``中引用:${}
                        history.push(`/project/${item.id}`);
                      }}
                    >
                      <Avatar style={{ backgroundColor: '#87d068' }} size={64}>
                        {item.projectName.slice(0, 3)}
                      </Avatar>
                      <p
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 18,
                          marginTop: 8,
                        }}
                      >
                        {item.projectName}
                      </p>
                    </Card>
                  </Popover>
                </Col>
              ))
            )}
          </Row>
        </Spin>
      </PageContainer>
    );
  }
}
