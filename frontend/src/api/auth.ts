import { apiClient } from './client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '@/types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return data;
  },

  register: async (userData: RegisterRequest) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await apiClient.post('/auth/refresh', { refreshToken });
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<{ success: boolean; data: User }>(
      '/auth/me'
    );
    return data.data;
  },

  getHealth: async () => {
    const { data } = await apiClient.get('/health');
    return data;
  },
};
