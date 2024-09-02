import { Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';
import { PrismaUserRepository } from './prisma/repositories/prisma-user.repository';
import { PrismaTutorialRepository } from './prisma/repositories/prisma-tutorial.repository';
import { UserRepository } from '@application/domain/repositories/user.repository';
import { BCryptModule } from '@application/services/bcrypt/bcrypt.module';
import { TutorialRepository } from '@application/domain/repositories/tutorial.repository';

@Module({
  imports: [BCryptModule],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: TutorialRepository,
      useClass: PrismaTutorialRepository,
    },
  ],
  exports: [UserRepository, TutorialRepository],
})
export class DatabaseModule {}
