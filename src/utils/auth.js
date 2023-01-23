import { message } from 'antd';

export default {
  headers: (json = true) => {
    const token = localStorage.getItem('pitangToken');
    const headers = { token };
    if (json) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  },
  response: (res, info = false) => {
    if (res.code === 0) {
      if (info) {
        message.info(res.msg);
      }
      return true;
    }
    if (res.code === 401) {
      message.info(res.msg);
      localStorage.setItem('pitangToken', null);
      localStorage.setItem('pitangUser', null);
      window.location.href = '/user/login';
    }
    message.error(res.msg);
    return false;
  },
};
