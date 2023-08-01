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
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetAllParam,
  UserCreate,
  UserList,
  UserLogin,
  UserRoles,
  UserUpdate,
} from './users.dto';
import { UsersService } from './users.service';
import { Roles } from '../guard/roles.decorator';

@ApiTags('Управление пользователями')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @ApiOperation({ summary: 'Создать пользователя' })
  @HttpCode(204)
  @Roles([UserRoles.admin])
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
    @Req() request: Request,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { login: tokenLogin, role: tokenRole } = request.user ?? {};
    //С правами ниже админа, можно менять только себя
    if (![UserRoles.admin].includes(tokenRole) && tokenLogin !== login) {
      throw new Error();
    }
    await this.usersService.update(login, body);
  }

  @ApiOperation({ summary: 'Удалить пользователя' })
  @HttpCode(204)
  @Roles([UserRoles.admin])
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
