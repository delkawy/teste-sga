import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { UserRepository } from '@application/domain/repositories/user.repository';
import { PasswordEncrypter } from '@application/domain/services/PasswordEncrypter';
import { CreateUserDto } from '@infra/http/dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordEncrypter: PasswordEncrypter,
  ) {}

  async execute(data: CreateUserDto): Promise<void> {
    const userAlreadyExists = await this.userRepository.findOne({
      email: data.email,
    });

    if (userAlreadyExists) {
      throw new UnprocessableEntityException(
        'An account with this email cannot be created',
      );
    }

    await this.userRepository.create({
      ...data,
      password: await this.passwordEncrypter.hash(data.password),
    });
  }
}
