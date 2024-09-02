import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { EditTutorialUseCase } from './edit-tutorial.use-case';
import { InMemoryCacheService } from '@test/services/in-memory-cache-service';
import { makeTutorial } from '@test/factories/tutorial.factory';
import { InMemoryTutorialRepository } from '@test/repositories/in-memory-tutorial.repository';

describe('EditTutorialUseCase', () => {
  let editTutorialUseCase: EditTutorialUseCase;
  let tutorialRepository: InMemoryTutorialRepository;
  let cacheService: InMemoryCacheService;

  beforeEach(() => {
    tutorialRepository = new InMemoryTutorialRepository();
    cacheService = new InMemoryCacheService();
    editTutorialUseCase = new EditTutorialUseCase(
      tutorialRepository,
      cacheService,
    );
  });

  it('should edit a tutorial when it exists and title is not taken', async () => {
    const tutorial = makeTutorial();
    await tutorialRepository.create(tutorial);

    const updatedTutorial = { ...tutorial, title: 'Updated Title' };
    await editTutorialUseCase.execute({
      id: tutorial.id,
      user_id: tutorial.user_id,
      title: updatedTutorial.title,
      content: updatedTutorial.content,
    });

    const editedTutorial = await tutorialRepository.findByIdAndUserId(
      tutorial.id,
      tutorial.user_id,
    );

    expect(editedTutorial).toBeDefined();
    expect(editedTutorial.title).toBe(updatedTutorial.title);
  });

  it('should not edit a tutorial if it does not exist', async () => {
    await expect(
      editTutorialUseCase.execute({
        id: 'non-existing-id',
        user_id: 'some-user-id',
        title: 'New Title',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should not allow editing if the new title is already taken by another tutorial', async () => {
    const existingTutorial = makeTutorial();
    await tutorialRepository.create(existingTutorial);

    const tutorialToEdit = makeTutorial();
    await tutorialRepository.create(tutorialToEdit);

    await expect(
      editTutorialUseCase.execute({
        id: tutorialToEdit.id,
        user_id: tutorialToEdit.user_id,
        title: existingTutorial.title,
      }),
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it('should call cacheService.delByPreffix after editing a tutorial', async () => {
    const tutorial = makeTutorial();
    await tutorialRepository.create(tutorial);
    const cacheServiceDelByPreffixSpy = jest.spyOn(
      cacheService,
      'delByPreffix',
    );

    await editTutorialUseCase.execute({
      id: tutorial.id,
      user_id: tutorial.user_id,
      title: 'Updated Title',
      content: 'Updated Content',
    });

    expect(cacheServiceDelByPreffixSpy).toHaveBeenCalledWith('tutorials:*');
  });
});
