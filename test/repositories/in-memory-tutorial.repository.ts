import { TutorialEntity } from '@application/domain/entities/tutorial.entity';
import {
  FindAllTutorialParams,
  FindAllTutorialResponse,
  TutorialRepository,
} from '@application/domain/repositories/tutorial.repository';

export class InMemoryTutorialRepository implements TutorialRepository {
  public tutorials: TutorialEntity[] = [];

  async findAll({
    filters,
    page_number,
    page_size,
  }: FindAllTutorialParams): Promise<FindAllTutorialResponse> {
    const filteredTutorials = this.tutorials.filter((tutorial) => {
      return Object.entries(filters).every(
        ([key, value]) => tutorial[key] === value,
      );
    });

    const total_items = filteredTutorials.length;
    const items = filteredTutorials.slice(
      (page_number - 1) * page_size,
      page_number * page_size,
    );

    return { total_items, items };
  }

  async findByTitle(title: string): Promise<TutorialEntity | undefined> {
    return this.tutorials.find((tutorial) =>
      tutorial.title.toLowerCase().includes(title.toLowerCase()),
    );
  }

  async findByIdAndUserId(
    id: string,
    user_id: string,
  ): Promise<TutorialEntity | undefined> {
    return this.tutorials.find(
      (tutorial) => tutorial.id === id && tutorial.user_id === user_id,
    );
  }

  async create(data: TutorialEntity): Promise<void> {
    this.tutorials.push(data);
  }

  async delete({ id, user_id }: Partial<TutorialEntity>): Promise<void> {
    this.tutorials = this.tutorials.filter(
      (tutorial) => !(tutorial.id === id && tutorial.user_id === user_id),
    );
  }

  async edit({ id, ...data }: Partial<TutorialEntity>): Promise<void> {
    const index = this.tutorials.findIndex((tutorial) => tutorial.id === id);
    if (index !== -1) {
      this.tutorials[index] = { ...this.tutorials[index], ...data };
    }
  }
}
