import axios, {AxiosInstance, AxiosError} from 'axios';
import type {HomePageResponse} from '../types';

const BASE_URL = 'https://www.kentectraining.com';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  },
);

// API methods
export const api = {
  // Get home page data
  getHomePage: async (): Promise<HomePageResponse> => {
    const response = await apiClient.get<HomePageResponse>(
      '/umbraco/delivery/api/v2/content/item/home',
    );
    return response.data;
  },

  // Generic GET request
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await apiClient.get<T>(endpoint);
    return response.data;
  },

  // Generic POST request
  post: async <T, D = unknown>(endpoint: string, data?: D): Promise<T> => {
    const response = await apiClient.post<T>(endpoint, data);
    return response.data;
  },
};

// Helper to build full media URL
export const getMediaUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

export default api;
