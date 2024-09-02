import { Test, TestingModule } from '@nestjs/testing';
import { UnprocessableEntityException } from '@nestjs/common';

import { CreateUserUseCase } from '@application/use-cases/user/create-user.use-case';
import { AuthUserUseCase } from '@application/use-cases/user/auth-user.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthUserDto } from '../dto/auth-user.dto';
import { UserController } from './users.controller';

describe('UserController', () => {
  let userController: UserController;
  let createUserUseCase: CreateUserUseCase;
  let authUserUseCase: AuthUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: AuthUserUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    authUserUseCase = module.get<AuthUserUseCase>(AuthUserUseCase);
  });

  describe('create', () => {
    it('should call createUserUseCase.execute with correct parameters', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password',
      };
      const executeSpy = jest
        .spyOn(createUserUseCase, 'execute')
        .mockResolvedValue(undefined);

      await userController.create(createUserDto);

      expect(executeSpy).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('authenticate', () => {
    it('should call authUserUseCase.execute with correct parameters and return the result', async () => {
      const authUserDto: AuthUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const authResponse = { token: 'fake-jwt-token' };
      jest.spyOn(authUserUseCase, 'execute').mockResolvedValue(authResponse);

      const result = await userController.authenticate(authUserDto);

      expect(result).toEqual(authResponse);
      expect(authUserUseCase.execute).toHaveBeenCalledWith(authUserDto);
    });

    it('should handle errors correctly', async () => {
      const authUserDto: AuthUserDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };
      jest
        .spyOn(authUserUseCase, 'execute')
        .mockRejectedValue(
          new UnprocessableEntityException('Invalid credentials'),
        );

      await expect(userController.authenticate(authUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });
});
