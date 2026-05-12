import api from './api';

export default class StatsService {
  async getDashboardStats() {
    const { data } = await api.get('/dashboard/stats');
    return data.data;
  }
}
