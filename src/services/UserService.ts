import { userRepository } from '@/repositories/userRepository';
import type { User } from '@/types';

export class UserService {
  static async getUsers(): Promise<User[]> {
    return await userRepository.findAll();
  }

  static async getUserById(id: string): Promise<User | null> {
    return await userRepository.findById(id);
  }

  static async updateUser(id: string, data: Partial<User>): Promise<User> {
    return await userRepository.update(id, data);
  }

  static async inviteUser(data: Omit<User, 'id' | 'avatar'>): Promise<User> {
    const newUser = {
      ...data,
      avatar: `https://i.pravatar.cc/150?u=${data.email}`,
    };
    return await userRepository.create(newUser as Omit<User, 'id'>);
  }

  static async removeUser(id: string): Promise<boolean> {
    return await userRepository.delete(id);
  }

  static async updateUserRole(id: string, role: string): Promise<User> {
    return await userRepository.update(id, { role });
  }
}
