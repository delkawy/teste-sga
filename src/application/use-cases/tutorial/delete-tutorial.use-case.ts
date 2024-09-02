import { Injectable, NotFoundException } from '@nestjs/common';

import { TutorialRepository } from '@application/domain/repositories/tutorial.repository';
import { CacheService } from '@application/domain/services/CacheService';

interface DeleteTutorialRequest {
  id: string;
  user_id: string;
}

@Injectable()
export class DeleteTutorialUseCase {
  constructor(
    private readonly tutorialRepository: TutorialRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute(data: DeleteTutorialRequest): Promise<void> {
    const tutorial = await this.tutorialRepository.findByIdAndUserId(
      data.id,
      data.user_id,
    );

    if (!tutorial) throw new NotFoundException('Tutorial not found');

    await this.tutorialRepository.delete(data);
    await this.cacheService.delByPreffix('tutorials:*');
  }
}
