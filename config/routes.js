// 嵌套routes, layout->page->component
// path,component,authority,routes,icon,name
// .. === /src
// . 相对路径 /src/page
export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
              },
              {
                path: '/request',
                name: '调试页面',
                icon: 'rocket',
                component: './Request',
              },
              {
                path: '/project',
                name: '项目管理',
                icon: 'book',
                component: './Project/Project',
              },
              {
                path: '/project/:id',
                hideInMenu: true,
                component: './Project/ProjectDetail',
              },
              {
                path: '/environment',
                name: '环境配置',
                icon: 'book',
                component: './Environment/Environment',
              },
              {
                path: '/globalconfig',
                name: '全局变量',
                icon: 'book',
                component: './GlobalConfig/GlobalConfig',
              },
              {
                path: '/minMap',
                name: '思维导图',
                icon: 'book',
                component: './MinMap/MinMap',
              },
              {
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                component: './Admin',
                authority: ['admin'],
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: 'sub-page',
                    icon: 'smile',
                    component: './Welcome',
                    authority: ['admin'],
                  },
                ],
              },
              {
                name: 'list.table-list',
                icon: 'table',
                path: '/list',
                component: './TableList',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
