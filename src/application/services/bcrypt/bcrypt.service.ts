import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';

import { PasswordEncrypter } from '@application/domain/services/PasswordEncrypter';
import { jwtConstants } from '@configs/auth';

@Injectable()
export class BCryptService implements PasswordEncrypter {
  async hash(password: string): Promise<string> {
    return hash(password, jwtConstants.hashSaltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
