import { Injectable } from '@nestjs/common';
import { User } from './user';
import { Role } from '../shared/security/role.enum';

@Injectable()
export class UserService {
  private users: User[] = [
    new User(1, 'admin', 'admin', [Role.ADMIN]),
    new User(2, 'reader', 'read123', [Role.USER]),
    new User(3, 'restaurant_viewer', 'restaurant456', [Role.RESTAURANT_USER]),
    new User(4, 'editor', 'edit789', [Role.MANAGER]),
    new User(5, 'deletor', 'del000', [Role.DELETOR]),
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
