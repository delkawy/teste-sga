import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserRepository } from '@application/domain/repositories/user.repository';
import { PasswordEncrypter } from '@application/domain/services/PasswordEncrypter';
import { AuthUserDto } from '@infra/http/dto/auth-user.dto';
import { JwtService } from '@application/domain/services/JwtService';

@Injectable()
export class AuthUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly passwordEncrypter: PasswordEncrypter,
  ) {}

  async execute({ email, password }: AuthUserDto): Promise<any> {
    const user = await this.userRepository.findOne({ email });

    if (!user) throw new UnauthorizedException();

    const isValidPassword = await this.passwordEncrypter.compare(
      password,
      user.password,
    );

    if (!isValidPassword) throw new UnauthorizedException();

    const payload = { sub: user.id, name: user.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
