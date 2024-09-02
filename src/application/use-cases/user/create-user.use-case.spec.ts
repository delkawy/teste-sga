import { makeUser } from '@test/factories/user.factory';
import { InMemoryUserRepository } from '@test/repositories/in-memory-user.repository';
import { CreateUserUseCase } from './create-user.use-case';
import { UnprocessableEntityException } from '@nestjs/common';
import { InMemoryPasswordEncrypter } from '@test/services/in-memory-password-encrypter';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: InMemoryUserRepository;
  let passwordEncrypter: InMemoryPasswordEncrypter;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    passwordEncrypter = new InMemoryPasswordEncrypter();
    createUserUseCase = new CreateUserUseCase(
      userRepository,
      passwordEncrypter,
    );
  });

  it('should create a user when the email does not already exist', async () => {
    const user = makeUser();

    await createUserUseCase.execute(user);

    expect(userRepository.users.length).toBe(1);
  });

  it('should not create a user if the email is already taken', async () => {
    const user = makeUser();

    await createUserUseCase.execute(user);
    await expect(createUserUseCase.execute(user)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });
});
