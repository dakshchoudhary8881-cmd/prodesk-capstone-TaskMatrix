import { apiClient } from '@/api/client';
import type { User } from '@/types';

export class AuthRepository {
  async register(data: any): Promise<void> {
    await apiClient.post('/auth/register', data);
  }

  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<any>('/auth/login', { email, password });
    // The real backend sets an HTTP-only cookie, so no token is exposed
    return { user: response, token: 'http-only-cookie' };
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch {
      // Silently ignore logout errors
    }
  }

  async getMe(): Promise<User | null> {
    try {
      const user = await apiClient.get<User>('/auth/me');
      return user || null;
    } catch {
      return null;
    }
  }
}

export const authRepository = new AuthRepository();
