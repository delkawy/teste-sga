import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { TutorialsController } from './tutorials.controller';
import { ListAllTutorialUseCase } from '@application/use-cases/tutorial/list-all-tutorial.use-case';
import { CreateTutorialUseCase } from '@application/use-cases/tutorial/create-tutorial.use-case';
import { DeleteTutorialUseCase } from '@application/use-cases/tutorial/delete-tutorial.use-case';
import { EditTutorialUseCase } from '@application/use-cases/tutorial/edit-tutorial.use-case';
import { ListAllTutorialDto } from '../dto/list-all-tutorial.dto';
import { CreateTutorialDto } from '../dto/create-tutorial.dto';
import { EditTutorialDto } from '../dto/edit-tutorial.dto';
import { JwtService } from '@application/domain/services/JwtService';
import { CacheService } from '@application/domain/services/CacheService';
import { AuthGuard } from '../guards/auth.guard';

describe('TutorialsController', () => {
  let controller: TutorialsController;
  let listAllTutorialUseCase: ListAllTutorialUseCase;
  let createTutorialUseCase: CreateTutorialUseCase;
  let deleteTutorialUseCase: DeleteTutorialUseCase;
  let editTutorialUseCase: EditTutorialUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutorialsController],
      providers: [
        {
          provide: ListAllTutorialUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: CreateTutorialUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteTutorialUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: EditTutorialUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { verify: jest.fn(), sign: jest.fn() },
        },
        {
          provide: CacheService,
          useValue: { get: jest.fn(), set: jest.fn(), delByPreffix: jest.fn() },
        },
        {
          provide: AuthGuard,
          useClass: AuthGuard,
        },
      ],
    }).compile();

    controller = module.get<TutorialsController>(TutorialsController);
    listAllTutorialUseCase = module.get<ListAllTutorialUseCase>(
      ListAllTutorialUseCase,
    );
    createTutorialUseCase = module.get<CreateTutorialUseCase>(
      CreateTutorialUseCase,
    );
    deleteTutorialUseCase = module.get<DeleteTutorialUseCase>(
      DeleteTutorialUseCase,
    );
    editTutorialUseCase = module.get<EditTutorialUseCase>(EditTutorialUseCase);
  });

  describe('listAll', () => {
    it('should call listAllTutorialUseCase.execute with correct parameters', async () => {
      const dto: ListAllTutorialDto = {
        title: 'Test',
        page_number: 1,
        page_size: 10,
      };
      const executeSpy = jest
        .spyOn(listAllTutorialUseCase, 'execute')
        .mockResolvedValue([]);

      await controller.listAll(dto);

      expect(executeSpy).toHaveBeenCalledWith(dto);
    });
  });

  describe('create', () => {
    it('should call createTutorialUseCase.execute with correct parameters', async () => {
      const createTutorialDto: CreateTutorialDto = {
        title: 'New Tutorial',
        content: 'Content',
      };
      const request = { user: { sub: 'user-id' } };
      const executeSpy = jest
        .spyOn(createTutorialUseCase, 'execute')
        .mockResolvedValue(undefined);

      await controller.create(createTutorialDto, request as any);

      expect(executeSpy).toHaveBeenCalledWith({
        ...createTutorialDto,
        user_id: request.user.sub,
      });
    });

    it('should handle unauthorized access', async () => {
      const createTutorialDto: CreateTutorialDto = {
        title: 'New Tutorial',
        content: 'Content',
      };
      const request = { user: { sub: null } };
      jest
        .spyOn(createTutorialUseCase, 'execute')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.create(createTutorialDto, request as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('delete', () => {
    it('should call deleteTutorialUseCase.execute with correct parameters', async () => {
      const request = { user: { sub: 'user-id' } };
      const id = 'tutorial-id';
      const executeSpy = jest
        .spyOn(deleteTutorialUseCase, 'execute')
        .mockResolvedValue(undefined);

      await controller.delete(request as any, id);

      expect(executeSpy).toHaveBeenCalledWith({
        id,
        user_id: request.user.sub,
      });
    });

    it('should handle unauthorized access', async () => {
      const request = { user: { sub: null } };
      const id = 'tutorial-id';
      jest
        .spyOn(deleteTutorialUseCase, 'execute')
        .mockRejectedValue(new UnauthorizedException());

      await expect(controller.delete(request as any, id)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('edit', () => {
    it('should call editTutorialUseCase.execute with correct parameters', async () => {
      const editTutorialDto: EditTutorialDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };
      const request = { user: { sub: 'user-id' } };
      const id = 'tutorial-id';
      const executeSpy = jest
        .spyOn(editTutorialUseCase, 'execute')
        .mockResolvedValue(undefined);

      await controller.edit(request as any, id, editTutorialDto);

      expect(executeSpy).toHaveBeenCalledWith({
        id,
        user_id: request.user.sub,
        ...editTutorialDto,
      });
    });

    it('should handle unauthorized access', async () => {
      const editTutorialDto: EditTutorialDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };
      const request = { user: { sub: null } };
      const id = 'tutorial-id';
      jest
        .spyOn(editTutorialUseCase, 'execute')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.edit(request as any, id, editTutorialDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
