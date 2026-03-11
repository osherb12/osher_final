import axios from 'axios';
import { ApiResponse, Product, Order } from '@osher/shared';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle data extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data || { success: false, error: 'Network Error' });
  }
);

export default api;

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export const ProductApi = {
  getAll: (query?: ProductQuery): Promise<ApiResponse<{ products: Product[], total: number, pages: number, current: number }>> => {
    return api.get('/products', { params: query });
  },
  getById: (id: string): Promise<ApiResponse<Product>> => {
    return api.get(`/products/${id}`);
  }
};

export const OrderApi = {
  create: (order: Order): Promise<ApiResponse<Order>> => {
    return api.post('/orders', order);
  },
  getByUserId: (): Promise<ApiResponse<Order[]>> => {
    return api.get('/orders/my-orders');
  }
};
