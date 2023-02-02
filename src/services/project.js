import request from '@/utils/request';
import { CONFIG } from '@/consts/config';
import auth from '@/utils/auth';

export async function listProject(params) {
  return request(`${CONFIG.URL}/project/list?page=${params.page}&size=${params.size}&name=${params.name||''}`, {
    method: 'GET',
    headers: auth.headers(),
  });
}
export async function insertProject(params) {
  return request(`${CONFIG.URL}/project/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}
