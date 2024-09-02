import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
  abstract create(data: UserEntity): Promise<void>;
  abstract findOne(filter: Partial<UserEntity>): Promise<UserEntity>;
}
