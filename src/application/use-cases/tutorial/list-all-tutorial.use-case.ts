import { Injectable } from '@nestjs/common';

import { TutorialRepository } from '@application/domain/repositories/tutorial.repository';
import { CacheService } from '@application/domain/services/CacheService';
import { ListAllTutorialDto } from '@infra/http/dto/list-all-tutorial.dto';

interface FilterConditionsParams {
  filters: any;
  created_at_from?: Date;
  created_at_to?: Date;
  updated_at_from?: Date;
  updated_at_to?: Date;
}

@Injectable()
export class ListAllTutorialUseCase {
  constructor(
    private readonly tutorialRepository: TutorialRepository,
    private readonly cacheService: CacheService,
  ) {}

  async execute({
    title,
    page_number,
    page_size,
    ...data
  }: ListAllTutorialDto): Promise<any> {
    const filters = this.createFilterConditions({
      filters: { title },
      ...data,
    });

    const cacheKey = `tutorials:${JSON.stringify(filters)}:${page_number}:${page_size}`;
    const cachedData = await this.cacheService.get(cacheKey);

    if (cachedData) return cachedData;

    const { items, total_items } = await this.tutorialRepository.findAll({
      page_number,
      page_size,
      filters,
    });

    const response = {
      tutorials: items,
      metadata: {
        total_items,
        total_pages: Math.ceil(total_items / page_size),
        page_number: Number(page_number),
        page_size,
      },
    };

    await this.cacheService.set(cacheKey, response);

    return response;
  }

  private createFilterConditions({
    filters,
    created_at_from,
    created_at_to,
    updated_at_from,
    updated_at_to,
  }: FilterConditionsParams) {
    const conditions = {};

    Object.keys(filters).forEach((key) => {
      conditions[key] = filters[key];
    });

    if (created_at_from) {
      conditions['created_at'] = { gte: created_at_from };
    }

    if (created_at_to) {
      conditions['created_at'] = {
        ...conditions['created_at'],
        lte: created_at_to,
      };
    }

    if (updated_at_from) {
      conditions['updated_at'] = { gte: updated_at_from };
    }

    if (updated_at_to) {
      conditions['updated_at'] = {
        ...conditions['updated_at'],
        lte: updated_at_to,
      };
    }

    return conditions;
  }
}
