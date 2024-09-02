import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import {
  FindAllTutorialParams,
  FindAllTutorialResponse,
  TutorialRepository,
} from '@application/domain/repositories/tutorial.repository';
import { TutorialEntity } from '@application/domain/entities/tutorial.entity';

@Injectable()
export class PrismaTutorialRepository implements TutorialRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    filters,
    page_number,
    page_size,
  }: FindAllTutorialParams): Promise<FindAllTutorialResponse> {
    const [total_items, items] = await Promise.all([
      this.prisma.tutorial.count({
        where: filters,
      }),
      this.prisma.tutorial.findMany({
        where: filters,
        skip: (page_number - 1) * page_size,
        take: page_size,
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    return { total_items, items };
  }

  async findByTitle(title: string): Promise<TutorialEntity> {
    return this.prisma.tutorial.findFirst({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
    });
  }

  async findByIdAndUserId(
    id: string,
    user_id: string,
  ): Promise<TutorialEntity> {
    return await this.prisma.tutorial.findFirst({
      where: { id, user_id },
    });
  }

  async create(data: TutorialEntity): Promise<void> {
    await this.prisma.tutorial.create({ data });
  }

  async delete({ id, user_id }: Partial<TutorialEntity>): Promise<void> {
    await this.prisma.tutorial.delete({
      where: { id, user_id },
    });
  }

  async edit({ id, ...data }: Partial<TutorialEntity>): Promise<void> {
    await this.prisma.tutorial.update({
      where: { id },
      data,
    });
  }
}
