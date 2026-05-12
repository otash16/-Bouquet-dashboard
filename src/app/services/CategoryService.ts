import api from './api';

export default class CategoryService {
  async getCategories(params?: Record<string, string | number>) {
    const { data } = await api.get('/dashboard/categories', { params });
    return data.data;
  }

  async getCategoryById(id: string) {
    const { data } = await api.get(`/dashboard/categories/${id}`);
    return data.data;
  }

  async createCategory(body: Record<string, unknown>) {
    const { data } = await api.post('/dashboard/categories', body);
    return data.data;
  }

  async updateCategory(id: string, body: Record<string, unknown>) {
    const { data } = await api.patch(`/dashboard/categories/${id}`, body);
    return data.data;
  }

  async deleteCategory(id: string) {
    const { data } = await api.delete(`/dashboard/categories/${id}`);
    return data.data;
  }
}
