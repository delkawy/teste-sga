import { UserEntity } from 'src/application/domain/entities/user.entity';
import { UserRepository } from 'src/application/domain/repositories/user.repository';

export class InMemoryUserRepository implements UserRepository {
  public users: UserEntity[] = [];

  async create(data: UserEntity): Promise<void> {
    this.users.push(data);
  }

  async findOne(filter: Partial<UserEntity>): Promise<UserEntity> {
    return this.users.find((user) =>
      Object.entries(filter).every(([key, value]) => user[key] === value),
    );
  }
}
