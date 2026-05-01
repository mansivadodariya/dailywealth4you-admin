import axios from 'axios';
import { toast } from 'react-toastify';
import { clearAuthCookies, getTokenFromCookie } from './cookies';
import config from '@/config';

const TOAST_ID = 'api-error';
const showErrorToast = (message) => {
  if (!toast.isActive(TOAST_ID)) {
    toast.error(message, { toastId: TOAST_ID });
  }
};

const api = axios.create({
  baseURL: config.APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearAuthCookies();
    }

    const fallbackMessage = 'Something went wrong. Please try again.';
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallbackMessage;

    showErrorToast(message);
    return Promise.reject(message);
  }
);

export default api;
