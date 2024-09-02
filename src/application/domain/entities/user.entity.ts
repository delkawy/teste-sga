import { Entity } from '@application/base/entity';

export class UserEntity extends Entity {
  name: string;
  email: string;
  password: string;
}
