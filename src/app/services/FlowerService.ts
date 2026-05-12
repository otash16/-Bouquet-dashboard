import api from './api';

export default class FlowerService {
  async getFlowers(params?: Record<string, string | number>) {
    const { data } = await api.get('/dashboard/flowers', { params });
    return data.data;
  }

  async getFlowerById(id: string) {
    const { data } = await api.get(`/dashboard/flowers/${id}`);
    return data.data;
  }

  async createFlower(body: Record<string, unknown>) {
    const { data } = await api.post('/dashboard/flowers', body);
    return data.data;
  }

  async updateFlower(id: string, body: Record<string, unknown>) {
    const { data } = await api.patch(`/dashboard/flowers/${id}`, body);
    return data.data;
  }

  async deleteFlower(id: string) {
    const { data } = await api.delete(`/dashboard/flowers/${id}`);
    return data.data;
  }
}
