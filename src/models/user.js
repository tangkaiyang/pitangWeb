import { queryCurrent, query as queryUsers } from '@/services/user';
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    // 生成器
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      // const response = yield call(queryCurrent);
      const token = localStorage.getItem('pitangToken');
      const userInfo = localStorage.getItem('pitangUser');
      if (!token || !userInfo) {
        history.pushState(null, 'Login', '/user/login');
        return;
      }
      // 反序列化:string->user对象
      const info = JSON.parse(userInfo);
      yield put({
        type: 'saveCurrentUser',
        payload: info,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
