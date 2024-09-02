import { JwtService } from '@application/domain/services/JwtService';

export class InMemoryJwtService implements JwtService {
  async signAsync(): Promise<string> {
    return 'jwt-token';
  }

  async verifyAsync(token: string): Promise<any> {
    return token === 'jwt-token';
  }
}
