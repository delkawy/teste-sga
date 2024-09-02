import { PasswordEncrypter } from '@application/domain/services/PasswordEncrypter';

export class InMemoryPasswordEncrypter implements PasswordEncrypter {
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return password === hashedPassword;
  }

  async hash(password: string): Promise<string> {
    return password;
  }
}
