import request from '@/utils/request';
import { CONFIG } from '@/consts/config';
import auth from '@/utils/auth';

export async function listGlobalConfigs(search) {
  return request(`${CONFIG.URL}/environment/gconfig/list`, {
    method: 'GET',
    params: { key: search },
    headers: auth.headers(),
  });
}
export async function addGlobalConfig(data) {
  return request(`${CONFIG.URL}/environment/gconfig/add`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateGlobalConfig(data) {
  return request(`${CONFIG.URL}/environment/gconfig/update`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function deleteGlobalConfig(conId) {
  return request(`${CONFIG.URL}/environment/gconfig/delete`, {
    method: 'POST',
    data: { id: conId },
    headers: auth.headers(),
  });
}
