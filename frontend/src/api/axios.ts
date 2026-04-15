import axios from 'axios';

const configuredApiUrl = process.env.REACT_APP_API_URL?.trim();
const normalizedApiUrl = configuredApiUrl
  ? configuredApiUrl.replace(/\/+$/, '')
  : '';

const api = axios.create({
  baseURL: normalizedApiUrl
    ? normalizedApiUrl.endsWith('/api')
      ? normalizedApiUrl
      : `${normalizedApiUrl}/api`
    : 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
