import axios from 'axios';
import { serverApi } from '@/libs/config';

const api = axios.create({ baseURL: serverApi });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default class AuthService {
  async signin(username: string, password: string) {
    const { data } = await api.post('/dashboard/admins/signin', { username, password });
    return data.data;
  }

  async getInfo() {
    const { data } = await api.get('/dashboard/admins/info');
    return data.data;
  }

  async refresh() {
    const { data } = await api.get('/dashboard/admins/refresh', { withCredentials: true });
    return data.data;
  }

  async logout() {
    await api.get('/dashboard/admins/logout');
  }
}
