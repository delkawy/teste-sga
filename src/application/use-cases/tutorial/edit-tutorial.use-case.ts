import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { TutorialEntity } from '@application/domain/entities/tutorial.entity';
import { TutorialRepository } from '@application/domain/repositories/tutorial.repository';
import { CacheService } from '@application/domain/services/CacheService';

@Injectable()
export class EditTutorialUseCase {
  constructor(
    private readonly tutorialRepository: TutorialRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(data: Partial<TutorialEntity>): Promise<void> {
    const tutorial = await this.tutorialRepository.findByIdAndUserId(
      data.id,
      data.user_id,
    );

    if (!tutorial) throw new NotFoundException('Tutorial not found');

    if (data.title) {
      const tutorialTitle = await this.tutorialRepository.findByTitle(
        data.title,
      );

      if (tutorialTitle && tutorialTitle.id !== tutorial.id)
        throw new UnprocessableEntityException(
          'A tutorial with this title already exists',
        );
    }

    await this.tutorialRepository.edit({
      id: data.id,
      title: data.title,
      content: data.content,
    });
    await this.cacheService.delByPreffix('tutorials:*');
  }
}
