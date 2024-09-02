import { CreateTutorialUseCase } from './create-tutorial.use-case';
import { UnprocessableEntityException } from '@nestjs/common';
import { makeTutorial } from '@test/factories/tutorial.factory';
import { InMemoryTutorialRepository } from '@test/repositories/in-memory-tutorial.repository';
import { InMemoryCacheService } from '@test/services/in-memory-cache-service';

describe('CreateTutorialUseCase', () => {
  let createTutorialUseCase: CreateTutorialUseCase;
  let tutorialRepository: InMemoryTutorialRepository;
  let cacheService: InMemoryCacheService;

  beforeEach(() => {
    tutorialRepository = new InMemoryTutorialRepository();
    cacheService = new InMemoryCacheService();
    createTutorialUseCase = new CreateTutorialUseCase(
      tutorialRepository,
      cacheService,
    );
  });

  it('should create a tutorial when the title does not already exist', async () => {
    const tutorial = makeTutorial();

    await createTutorialUseCase.execute(tutorial);

    expect(tutorialRepository.tutorials.length).toBe(1);
  });

  it('should not create a tutorial if the title already exists', async () => {
    const tutorial = makeTutorial();

    await createTutorialUseCase.execute(tutorial);
    await expect(createTutorialUseCase.execute(tutorial)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });

  it('should call cacheService.delByPreffix after creating a tutorial', async () => {
    const tutorial = makeTutorial();
    const cacheServiceDelByPreffixSpy = jest.spyOn(
      cacheService,
      'delByPreffix',
    );

    await createTutorialUseCase.execute(tutorial);

    expect(cacheServiceDelByPreffixSpy).toHaveBeenCalledWith('tutorials:*');
  });
});
