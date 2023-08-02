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
import { errorMessage } from '../utils/error';

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
  ): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { login: tokenLogin, role: tokenRole } = request.user ?? {};
    const { locked, role, ...params } = body;
    //С правами ниже админа, можно менять только себя, запрещено менять роль и блокировать/разблокировать
    if (![UserRoles.admin].includes(tokenRole)) {
      if (tokenLogin !== login) {
        throw new HttpException(
          errorMessage.NotEnoughAccessRights,
          HttpStatus.FORBIDDEN,
        );
      }
      return this.usersService.update(login, params);
    }

    return this.usersService.update(login, { locked, role, ...params });
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
  async getAll(@Query() query: GetAllParam): Promise<UserList> {
    return this.usersService.getAll(query);
  }
}
