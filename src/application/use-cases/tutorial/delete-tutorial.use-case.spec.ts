import { DeleteTutorialUseCase } from './delete-tutorial.use-case';
import { NotFoundException } from '@nestjs/common';
import { InMemoryCacheService } from '@test/services/in-memory-cache-service';
import { InMemoryTutorialRepository } from '@test/repositories/in-memory-tutorial.repository';
import { makeTutorial } from '@test/factories/tutorial.factory';

describe('DeleteTutorialUseCase', () => {
  let deleteTutorialUseCase: DeleteTutorialUseCase;
  let tutorialRepository: InMemoryTutorialRepository;
  let cacheService: InMemoryCacheService;

  beforeEach(() => {
    tutorialRepository = new InMemoryTutorialRepository();
    cacheService = new InMemoryCacheService();
    deleteTutorialUseCase = new DeleteTutorialUseCase(
      tutorialRepository,
      cacheService,
    );
  });

  it('should delete a tutorial when it exists', async () => {
    const tutorial = makeTutorial();
    await tutorialRepository.create(tutorial);

    await deleteTutorialUseCase.execute({
      id: tutorial.id,
      user_id: tutorial.user_id,
    });

    expect(tutorialRepository.tutorials.length).toBe(0);
  });

  it('should not delete a tutorial if it does not exist', async () => {
    await expect(
      deleteTutorialUseCase.execute({
        id: 'non-existing-id',
        user_id: 'some-user-id',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should call cacheService.delByPreffix after deleting a tutorial', async () => {
    const tutorial = makeTutorial();
    await tutorialRepository.create(tutorial);
    const cacheServiceDelByPreffixSpy = jest.spyOn(
      cacheService,
      'delByPreffix',
    );

    await deleteTutorialUseCase.execute({
      id: tutorial.id,
      user_id: tutorial.user_id,
    });

    expect(cacheServiceDelByPreffixSpy).toHaveBeenCalledWith('tutorials:*');
  });
});
