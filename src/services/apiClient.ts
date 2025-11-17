// Этот файл — сердце авторизации: добавляет токен и обновляет его автоматически
import axios from 'axios';
import { BASE_URL } from './constants';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Автоматически добавляем access_token в каждый запрос
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Автоматическое обновление токена при 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('Нет refresh токена');

        const res = await axios.post(`${BASE_URL}/user/token/refresh/`, {
          refresh,
        });
        const newAccess = res.data.access;

        localStorage.setItem('access_token', newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(originalRequest); // повторяем запрос
      } catch {
        // refresh-токен тоже мёртвый → выкидываем пользователя
        localStorage.clear();
        window.location.href = '/auth/signin';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
