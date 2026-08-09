import { authRepository } from '@/repositories/authRepository';

export class AuthService {
  static async register(data: any) {
    return await authRepository.register(data);
  }

  static async login(email: string, password?: string) {
    return await authRepository.login(email, password);
  }

  static async logout() {
    return await authRepository.logout();
  }

  static async getMe() {
    return await authRepository.getMe();
  }
}
