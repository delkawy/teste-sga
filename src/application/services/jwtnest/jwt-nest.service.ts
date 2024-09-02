import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { jwtConstants } from '@configs/auth';
import { JwtService } from '@application/domain/services/JwtService';

@Injectable()
export class JwtNestService implements JwtService {
  private readonly jwtService: NestJwtService = new NestJwtService();

  async signAsync(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiresIn,
    });
  }

  async verifyAsync(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, { secret: jwtConstants.secret });
  }
}
