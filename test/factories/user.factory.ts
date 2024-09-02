import { faker } from '@faker-js/faker';

import { UserEntity } from '@application/domain/entities/user.entity';

export function makeUser(override: Partial<UserEntity> = {}): UserEntity {
  const user = new UserEntity();

  user.id = faker.string.uuid();
  user.name = faker.person.fullName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  user.updated_at = new Date();
  user.created_at = new Date();

  return { ...user, ...override };
}
