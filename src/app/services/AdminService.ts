import api from './api';

export default class AdminService {
  async getAdmins(params?: Record<string, string | number>) {
    const { data } = await api.get('/dashboard/admins', { params });
    return data.data;
  }

  async getAdminById(id: string) {
    const { data } = await api.get(`/dashboard/admins/${id}`);
    return data.data;
  }

  async createAdmin(body: Record<string, unknown>) {
    const { data } = await api.post('/dashboard/admins', body);
    return data.data;
  }

  async updateAdmin(id: string, body: Record<string, unknown>) {
    const { data } = await api.patch(`/dashboard/admins/${id}`, body);
    return data.data;
  }

  async deleteAdmin(id: string) {
    const { data } = await api.delete(`/dashboard/admins/${id}`);
    return data.data;
  }
}
