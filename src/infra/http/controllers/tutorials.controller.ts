import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { ListAllTutorialDto } from '../dto/list-all-tutorial.dto';
import { PaginationFilterPipe } from '../pipes/pagination.pipe';
import { CreateTutorialDto } from '../dto/create-tutorial.dto';
import { ListAllTutorialUseCase } from '@application/use-cases/tutorial/list-all-tutorial.use-case';
import { CreateTutorialUseCase } from '@application/use-cases/tutorial/create-tutorial.use-case';
import { AuthGuard } from '../guards/auth.guard';
import { DeleteTutorialUseCase } from '@application/use-cases/tutorial/delete-tutorial.use-case';
import { EditTutorialUseCase } from '@application/use-cases/tutorial/edit-tutorial.use-case';
import { EditTutorialDto } from '../dto/edit-tutorial.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('tutorials')
@Controller('tutorial')
export class TutorialsController {
  constructor(
    private readonly listAllTutorialUseCase: ListAllTutorialUseCase,
    private readonly createTutorialUseCase: CreateTutorialUseCase,
    private readonly deleteTutorialUseCase: DeleteTutorialUseCase,
    private readonly editTutorialUseCase: EditTutorialUseCase,
  ) {}

  @Get()
  @UsePipes(PaginationFilterPipe)
  async listAll(@Query() queries: ListAllTutorialDto) {
    return this.listAllTutorialUseCase.execute(queries);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() body: CreateTutorialDto, @Request() request) {
    const user_id = request.user.sub;

    await this.createTutorialUseCase.execute({ ...body, user_id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(
    @Request() request,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const user_id = request.user.sub;

    await this.deleteTutorialUseCase.execute({ id, user_id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async edit(
    @Request() request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: EditTutorialDto,
  ) {
    const user_id = request.user.sub;

    await this.editTutorialUseCase.execute({ id, user_id, ...body });
  }
}
