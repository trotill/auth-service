import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWT_Refresh, LoginParams } from './auth.dto';
import { UserItem, UserList, UserLogin } from '../users/users.dto';
import { AuthService } from './auth.service';
import { ACCESS_TOKEN_COOKIE_NAME } from '../utils/const';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({
    summary: 'Залогиниться (access токен устанавливается в сервер куку!!!)',
  })
  @ApiResponse({ status: 200, type: JWT_Refresh })
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() body: LoginParams,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.login(body);
    if ('cookie' in response) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      response.cookie(ACCESS_TOKEN_COOKIE_NAME, tokens.access, {
        httpOnly: true,
      });
    }
    return {
      refreshToken: tokens.refresh,
    };
  }
  @ApiOperation({ summary: 'Разлогиниться' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post('logout/:login')
  async logout(@Param() { login }: UserLogin): Promise<void> {
    return this.authService.logout(login);
  }
  @ApiOperation({ summary: 'Получить новый access токен' })
  @ApiResponse({ status: 200, type: JWT_Refresh })
  @HttpCode(200)
  @Post('refresh')
  async refresh(
    @Body() { refreshToken }: JWT_Refresh,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.refresh(refreshToken);
    if ('cookie' in response) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      response.cookie(ACCESS_TOKEN_COOKIE_NAME, tokens.access, {
        httpOnly: true,
      });
    }
    return {
      refreshToken: tokens.refresh,
    };
  }
  @ApiOperation({
    summary: 'Получить информацию о пользователе по access токену',
  })
  @ApiResponse({ status: 200, type: UserItem })
  @Get()
  async whoAmi(@Req() request: Request): Promise<UserItem> {
    if ('cookies' in request) {
      const accessToken = request.cookies[ACCESS_TOKEN_COOKIE_NAME];
      return this.authService.getUserInfoByToken(accessToken);
    }
    throw new Error();
  }
}
