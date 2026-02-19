import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  phone_number?: string;
  role?: string;
};

export type LoginResponse = {
  message: string;
  data: {
    token: string;
    token_type: string;
    expires_in: number;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      tenant_id: string;
    };
  };
};

export type RegisterResponse = {
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenant_id: string;
    created_at: string;
  };
};

export type ErrorResponse = {
  error: string;
  code?: string;
  details?: string;
};

// Auth API functions
export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export default apiClient;
