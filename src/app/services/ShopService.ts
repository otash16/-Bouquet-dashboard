import api from './api';

export default class ShopService {
  async getShops(params?: Record<string, string | number>) {
    const { data } = await api.get('/dashboard/shops', { params });
    return data.data;
  }

  async getShopById(id: string) {
    const { data } = await api.get(`/dashboard/shops/${id}`);
    return data.data;
  }

  async createShop(body: Record<string, unknown>) {
    const { data } = await api.post('/dashboard/shops', body);
    return data.data;
  }

  async updateShop(id: string, body: Record<string, unknown>) {
    const { data } = await api.patch(`/dashboard/shops/${id}`, body);
    return data.data;
  }

  async deleteShop(id: string) {
    const { data } = await api.delete(`/dashboard/shops/${id}`);
    return data.data;
  }
}
