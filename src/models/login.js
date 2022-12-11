import { stringify } from 'querystring';
import { history } from 'umi';
// import { fakeAccountLogin } from '@/services/login';
import { login, register } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { CONFIG } from '@/consts/config';
const Model = {
  namespace: 'login', // redux的key
  state: {
    status: undefined,
  },
  effects: {
    *register({ payload }, { call, _ }) {
      const response = yield call(register, {
        username: payload.username,
        password: payload.password,
        name: payload.name,
        email: payload.email,
      });
      if (response.code !== 0) {
        message.error(response.msg);
        return;
      }
      payload.setType('account');
      message.success(response.msg);
    },
    *login({ payload }, { call, put }) {
      // const response = yield call(fakeAccountLogin, payload);
      const response = yield call(login, payload); // call 调用外部异步方法
      yield put({
        //redux的dispatch
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.code === 0) {
        debugger;
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉 🎉 登录成功！');
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            message.error(response.msg);
          }
        }

        history.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      // 导入用户信息
      localStorage.setItem('pitangToken', payload.data.token);
      // localStorage操作浏览器缓存,但只接受string和string的键值对,故需将user对象序列化为string
      localStorage.setItem('pitangUser', JSON.stringify(payload.data.user));
      // setAuthority(payload.currentAuthority);
      setAuthority(CONFIG.ROLE[payload.data.user.role]);
      return { ...state, status: payload.code === 200 ? 'ok' : 'error', type: payload.type };
    },
  },
};
export default Model;
