import { BaseRepository } from './baseRepository';
import type { User } from '@/types';
import db from '@/mock/db.json';

class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users', db.users as User[]);
  }
}

export const userRepository = new UserRepository();
