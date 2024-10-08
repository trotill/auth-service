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
  UserItem,
  UserList,
  UserLogin,
  UserRoles,
  UserUpdate,
} from './users.dto';
import { UsersService } from './users.service';
import { Roles } from '../guard/roles.decorator';
import { ErrorMessage } from '../utils/error';
import type { RequestWU } from './user.types';
import { ALLOW_USER_REGISTRATION, DENY_GET_USER_LIST } from '../utils/const';

@ApiTags('User management')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @ApiOperation({ summary: 'Create a user' })
  @HttpCode(204)
  @Roles([UserRoles.admin])
  @Post()
  async create(@Body() body: UserCreate) {
    await this.usersService.create(body);
  }

  @ApiOperation({ summary: 'Change user' })
  @HttpCode(204)
  @Put(':login')
  async update(
    @Body() body: UserUpdate,
    @Param() { login }: UserLogin,
    @Req() request: RequestWU,
  ): Promise<[number]> {
    const { login: tokenLogin, role: tokenRole } = request.user ?? {};
    const { locked, role, ...params } = body;
    //With rights below admin, you can only change yourself, it is forbidden to change the role and block/unblock
    if ([UserRoles.admin].includes(tokenRole as UserRoles)) {
      return this.usersService.update(
        login,
        { locked, role, ...params },
        tokenLogin,
      );
    }
    if (tokenLogin !== login) {
      throw new HttpException(
        ErrorMessage.NotEnoughAccessRights,
        HttpStatus.FORBIDDEN,
      );
    }
    return this.usersService.update(login, params, tokenLogin);
  }

  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(204)
  @Roles([UserRoles.admin])
  @Delete(':login')
  async delete(@Param() { login }: UserLogin): Promise<void> {
    const count = await this.usersService.delete(login);
    if (!count) {
      throw new HttpException(
        ErrorMessage.UserNotFound,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperation({ summary: 'Get list of users' })
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
  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({ status: 200, type: UserItem })
  @Get(':login')
  async getUserInfo(
    @Param() { login }: UserLogin,
    @Req() request: RequestWU,
  ): Promise<UserItem> {
    if (+DENY_GET_USER_LIST && request.user.role !== UserRoles.admin) {
      throw new ForbiddenException();
    }
    const {
      login: loginResult,
      role,
      locked,
      lastName,
      firstName,
      email,
      createdAt,
      updatedAt,
    } = await this.usersService.getUser(login);
    return {
      login: loginResult,
      role: role as UserRoles,
      locked,
      lastName,
      firstName,
      email,
      createdAt,
      updatedAt,
    };
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post('register')
  async register(@Body() body: RegisterUser): Promise<void> {
    if (!+ALLOW_USER_REGISTRATION) {
      throw new HttpException(
        ErrorMessage.NotAcceptable,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    await this.usersService.register(body);
  }
}
