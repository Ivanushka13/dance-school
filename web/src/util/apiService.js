import axios from 'axios';
import localforage from 'localforage';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
  headers: {
    'accept': 'application/json'
  },
});


const apiRequest = async ({
  method = 'get',
  url,
  data = null,
  params = null,
  requiresAuth = true,
  headers = {},
}) => {
  try {

    if (requiresAuth) {
      const token = await localforage.getItem('authToken');
      if (!token) {
        throw new Error('Токен авторизации не найден. Пожалуйста, войдите в систему.');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await apiClient({
      method,
      url,
      data,
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.detail || 'Ошибка сервера';
      console.error(`Exception occurred during request: url: ${url}, status: ${status}, message: ${message}`);
      throw new Error(`Ошибка ${status}: ${message}`);
    } else if (error.request) {
      throw new Error('Нет соединения с сервером. Проверьте интернет.');
    } else {
      throw new Error(error.message || 'Произошла ошибка при выполнении запроса.');
    }
  }
};


const login = async (credentials) => {
  try {
    const response = await apiRequest({
      method: 'post',
      url: '/auth/token',
      data: credentials,
      requiresAuth: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });


    if (response.access_token) {
      await localforage.setItem('authToken', response.access_token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};


const logout = async () => {
  await localforage.removeItem('authToken');
};

export { apiRequest, login, logout };