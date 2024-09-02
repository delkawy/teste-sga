import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserUseCase } from '@application/use-cases/user/create-user.use-case';
import { AuthUserDto } from '../dto/auth-user.dto';
import { AuthUserUseCase } from '@application/use-cases/user/auth-user.use-case';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly authUserUseCase: AuthUserUseCase,
  ) {}

  @Post('signup')
  async create(@Body() body: CreateUserDto) {
    await this.createUserUseCase.execute(body);
  }

  @Post('login')
  async authenticate(@Body() body: AuthUserDto) {
    return this.authUserUseCase.execute(body);
  }
}
