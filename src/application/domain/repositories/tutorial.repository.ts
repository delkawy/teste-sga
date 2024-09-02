import { TutorialEntity } from '../entities/tutorial.entity';

export interface FindAllTutorialParams {
  page_number: number;
  page_size: number;
  filters: any;
}

export interface FindAllTutorialResponse {
  items: TutorialEntity[];
  total_items: number;
}

export abstract class TutorialRepository {
  abstract findAll(
    filter: FindAllTutorialParams,
  ): Promise<FindAllTutorialResponse>;
  abstract findByTitle(title: string): Promise<TutorialEntity>;
  abstract findByIdAndUserId(
    id: string,
    user_id: string,
  ): Promise<TutorialEntity>;
  abstract create(data: TutorialEntity): Promise<void>;
  abstract delete(data: Partial<TutorialEntity>): Promise<void>;
  abstract edit(data: Partial<TutorialEntity>): Promise<void>;
}
