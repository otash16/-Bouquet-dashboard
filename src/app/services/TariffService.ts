import api from './api';

export default class TariffService {
  async getTariffs(params?: Record<string, string | number>) {
    const { data } = await api.get('/dashboard/tariffs', { params });
    return data.data;
  }

  async getTariffById(id: string) {
    const { data } = await api.get(`/dashboard/tariffs/${id}`);
    return data.data;
  }

  async createTariff(body: Record<string, unknown>) {
    const { data } = await api.post('/dashboard/tariffs', body);
    return data.data;
  }

  async updateTariff(id: string, body: Record<string, unknown>) {
    const { data } = await api.patch(`/dashboard/tariffs/${id}`, body);
    return data.data;
  }

  async deleteTariff(id: string) {
    const { data } = await api.delete(`/dashboard/tariffs/${id}`);
    return data.data;
  }
}
