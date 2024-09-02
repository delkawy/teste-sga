import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { UserRepository } from '@application/domain/repositories/user.repository';
import { UserEntity } from '@application/domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: UserEntity): Promise<void> {
    await this.prisma.user.create({
      data,
    });
  }

  async findOne(filter: Partial<UserEntity>): Promise<UserEntity> {
    return this.prisma.user.findFirst({ where: filter });
  }
}
