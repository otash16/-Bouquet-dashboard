import api from './api';

export default class SubscriptionService {
  async getSubscriptions(params?: Record<string, string | number>) {
    const { data } = await api.get('/dashboard/subscriptions', { params });
    return data.data;
  }

  async getSubscriptionById(id: string) {
    const { data } = await api.get(`/dashboard/subscriptions/${id}`);
    return data.data;
  }

  async createSubscription(body: Record<string, unknown>) {
    const { data } = await api.post('/dashboard/subscriptions', body);
    return data.data;
  }

  async cancelSubscription(id: string) {
    const { data } = await api.patch(`/dashboard/subscriptions/${id}/cancel`);
    return data.data;
  }
}
