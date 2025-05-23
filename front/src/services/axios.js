import axios from 'axios';
import { getToken } from './auth';

// отладочная переменная окружения
console.log('[ENV] REACT_APP_API_URL =', process.env.REACT_APP_API_URL);

export const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

// диагностические логи
console.log('[API] baseURL =', api.defaults.baseURL);
api.interceptors.request.use(
  config => {
    // прикрепить jwt-токен, если доступен
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  response => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error('[API Response Error]', error);
    return Promise.reject(error);
  }
); 