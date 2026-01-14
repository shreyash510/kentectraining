import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your API URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
