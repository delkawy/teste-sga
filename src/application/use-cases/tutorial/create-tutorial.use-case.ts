import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { TutorialEntity } from '@application/domain/entities/tutorial.entity';
import { TutorialRepository } from '@application/domain/repositories/tutorial.repository';
import { CacheService } from '@application/domain/services/CacheService';

@Injectable()
export class CreateTutorialUseCase {
  constructor(
    private readonly tutorialRepository: TutorialRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(data: TutorialEntity): Promise<void> {
    const titleAlreadyExists = await this.tutorialRepository.findByTitle(
      data.title,
    );

    if (titleAlreadyExists)
      throw new UnprocessableEntityException(
        'A tutorial with this title already exists',
      );

    await this.tutorialRepository.create(data);
    await this.cacheService.delByPreffix('tutorials:*');
  }
}
