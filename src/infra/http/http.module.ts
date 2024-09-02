import { Module } from '@nestjs/common';

import { UserController } from './controllers/users.controller';
import { DatabaseModule } from '../database/database.module';
import { CreateUserUseCase } from 'src/application/use-cases/user/create-user.use-case';
import { AuthUserUseCase } from 'src/application/use-cases/user/auth-user.use-case';
import { BCryptModule } from 'src/application/services/bcrypt/bcrypt.module';
import { TutorialsController } from './controllers/tutorials.controller';
import { ListAllTutorialUseCase } from 'src/application/use-cases/tutorial/list-all-tutorial.use-case';
import { CreateTutorialUseCase } from 'src/application/use-cases/tutorial/create-tutorial.use-case';
import { EditTutorialUseCase } from 'src/application/use-cases/tutorial/edit-tutorial.use-case';
import { DeleteTutorialUseCase } from 'src/application/use-cases/tutorial/delete-tutorial.use-case';
import { CacheModule } from '../cache/cache.module';
import { JwtNestModule } from '@application/services/jwtnest/jwt-nest.module';

@Module({
  imports: [DatabaseModule, BCryptModule, CacheModule, JwtNestModule],
  controllers: [UserController, TutorialsController],
  providers: [
    CreateUserUseCase,
    AuthUserUseCase,
    ListAllTutorialUseCase,
    CreateTutorialUseCase,
    EditTutorialUseCase,
    DeleteTutorialUseCase,
  ],
})
export class HttpModule {}
