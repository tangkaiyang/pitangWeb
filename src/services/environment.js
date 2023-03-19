import request from '@/utils/request';
import { CONFIG } from '@/consts/config';
import auth from '@/utils/auth';

export async function listEnvironments(search) {
  return request(`${CONFIG.URL}/environment/list`, {
    method: 'GET',
    params: { name: search },
    headers: auth.headers(),
  });
}
export async function addEnvironment(data) {
  return request(`${CONFIG.URL}/environment/add`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateEnvironment(data) {
  return request(`${CONFIG.URL}/environment/update`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function deleteEnvironment(envId) {
  return request(`${CONFIG.URL}/environment/delete`, {
    method: 'POST',
    data: { id: envId },
    headers: auth.headers(),
  });
}
