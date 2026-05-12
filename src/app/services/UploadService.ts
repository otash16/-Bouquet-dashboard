import api from './api';

export default class UploadService {
  async uploadShopImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/dashboard/upload/shop', formData);
    return data.data;
  }

  async uploadFlowerImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/dashboard/upload/flower', formData);
    return data.data;
  }

  async uploadFlowerImages(files: File[]) {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    const { data } = await api.post('/dashboard/upload/flowers', formData);
    return data.data;
  }
}
