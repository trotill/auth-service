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
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetAllParam,
  RegisterUser,
  UserCreate,
  UserList,
  UserLogin,
  UserRoles,
  UserUpdate,
} from './users.dto';
import { UsersService } from './users.service';
import { Roles } from '../guard/roles.decorator';
import { errorMessage } from '../utils/error';
import type { RequestWU } from './user.types';
import { ALLOW_USER_REGISTRATION, DENY_GET_USER_LIST } from '../utils/const';

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
    @Req() request: RequestWU,
  ): Promise<[number]> {
    const { login: tokenLogin, role: tokenRole } = request.user ?? {};
    const { locked, role, ...params } = body;
    //С правами ниже админа, можно менять только себя, запрещено менять роль и блокировать/разблокировать
    if ([UserRoles.admin].includes(tokenRole as UserRoles)) {
      return this.usersService.update(login, { locked, role, ...params });
    }
    if (tokenLogin !== login) {
      throw new HttpException(
        errorMessage.NotEnoughAccessRights,
        HttpStatus.FORBIDDEN,
      );
    }
    return this.usersService.update(login, params);
  }

  @ApiOperation({ summary: 'Удалить пользователя' })
  @HttpCode(204)
  @Roles([UserRoles.admin])
  @Delete(':login')
  async delete(@Param() { login }: UserLogin): Promise<void> {
    const count = await this.usersService.delete(login);
    if (!count) {
      throw new HttpException(
        errorMessage.UserNotFound,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: 'Получить список пользователей' })
  @ApiResponse({ status: 200, type: UserList })
  @Get()
  async getAll(
    @Query() query: GetAllParam,
    @Req() request: RequestWU,
  ): Promise<UserList> {
    if (+DENY_GET_USER_LIST && request.user.role !== UserRoles.admin) {
      throw new ForbiddenException();
    }
    return this.usersService.getAll(query);
  }

  @ApiOperation({ summary: 'Зарегистрировать нового пользователя' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post('register')
  async register(@Body() body: RegisterUser): Promise<void> {
    if (!+ALLOW_USER_REGISTRATION) {
      throw new HttpException(
        errorMessage.NotAcceptable,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    await this.usersService.register(body);
  }
}
