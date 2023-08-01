import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetAllParam,
  UserBase,
  UserCreate,
  UserList,
  UserLogin,
  UserUpdate,
} from './users.dto';
import { UsersService } from './users.service';

@ApiTags('Управление пользователями')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @ApiOperation({ summary: 'Создать пользователя' })
  @HttpCode(204)
  @Post()
  async create(@Body() body: UserCreate) {
    await this.usersService.create(body);
  }

  @ApiOperation({ summary: 'Изменить пользователя' })
  @HttpCode(204)
  @Put(':login')
  async update(
    @Body() body: UserUpdate,
    @Param() { login }: UserLogin,
  ): Promise<void> {
    await this.usersService.update(login, body);
  }

  @ApiOperation({ summary: 'Удалить пользователя' })
  @HttpCode(204)
  @Delete(':login')
  async delete(@Param() { login }: UserLogin): Promise<void> {
    await this.usersService.delete(login);
  }

  @ApiOperation({ summary: 'Получить список пользователей' })
  @ApiResponse({ status: 200, type: UserList })
  @Get()
  async getAll(@Query() query: GetAllParam): Promise<UserList> {
    return this.usersService.getAll(query);
  }
}
