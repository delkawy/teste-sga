import { AuthUserUseCase } from './auth-user.use-case';
import { InMemoryPasswordEncrypter } from '@test/services/in-memory-password-encrypter';
import { InMemoryUserRepository } from '@test/repositories/in-memory-user.repository';
import { InMemoryJwtService } from '@test/services/in-memory-jwt-service';
import { makeUser } from '@test/factories/user.factory';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthUserUseCase', () => {
  let authUserUseCase: AuthUserUseCase;
  let userRepository: InMemoryUserRepository;
  let jwtService: InMemoryJwtService;
  let passwordEncrypter: InMemoryPasswordEncrypter;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    passwordEncrypter = new InMemoryPasswordEncrypter();
    jwtService = new InMemoryJwtService();
    authUserUseCase = new AuthUserUseCase(
      userRepository,
      jwtService,
      passwordEncrypter,
    );
  });

  it('should authenticate user and return access token', async () => {
    const user = makeUser();

    jest.spyOn(userRepository, 'findOne');
    jest.spyOn(jwtService, 'signAsync');

    await userRepository.create(user);
    const result = await authUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(userRepository.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      name: user.name,
    });
    expect(result).toEqual({ access_token: 'jwt-token' });
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const user = makeUser();
    await userRepository.create(user);

    await expect(
      authUserUseCase.execute({
        email: 'wrong-email',
        password: user.password,
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const user = makeUser();
    await userRepository.create(user);

    await expect(
      authUserUseCase.execute({
        email: user.email,
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
