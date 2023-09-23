import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWT_Refresh, LoginParams } from './auth.dto';
import { UserItem, UserLogin } from 'src/users/users.dto';
import { AuthService } from './auth.service';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  BRUTE_FORCE_LOGIN_DELAY,
  BRUTE_FORCE_LOGIN_LIMIT,
  BRUTE_FORCE_LOGIN_TTL,
  BRUTE_FORCE_WHOAMI_LIMIT,
  BRUTE_FORCE_WHOAMI_TTL,
} from 'src/utils/const';
import { setCookie } from './auth.utils';
import { errorMessage } from 'src/utils/error';
import { delay } from 'src/utils/time';
import { Throttle } from '@nestjs/throttler';
let counter = 0;
@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Throttle({
    default: {
      limit: +BRUTE_FORCE_LOGIN_LIMIT,
      ttl: +BRUTE_FORCE_LOGIN_TTL,
    },
  })
  @ApiOperation({
    summary: 'Залогиниться (access токен устанавливается в сервер куку!!!)',
  })
  @ApiResponse({ status: 200, type: JWT_Refresh })
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() body: LoginParams,
    @Res({ passthrough: true }) response: Response,
  ): Promise<JWT_Refresh> {
    try {
      console.log('counter', ++counter);

      const tokens = await this.authService.login(body);
      setCookie(response, tokens.access);
      return {
        refreshToken: tokens.refresh,
      };
    } catch (e) {
      await delay(+BRUTE_FORCE_LOGIN_DELAY); //brute force protect
      throw e;
    }
  }
  @ApiOperation({ summary: 'Разлогиниться' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post('logout/:login')
  async logout(
    @Param() { login }: UserLogin,
    @Res({ passthrough: true }) response: Response,
  ): Promise<number> {
    setCookie(response, '');
    return this.authService.logout(login);
  }
  @ApiOperation({ summary: 'Получить новый access токен' })
  @ApiResponse({ status: 200, type: JWT_Refresh })
  @HttpCode(200)
  @Post('refresh')
  async refresh(
    @Body() { refreshToken }: JWT_Refresh,
    @Res({ passthrough: true }) response: Response,
  ): Promise<JWT_Refresh> {
    const tokens = await this.authService.refresh(refreshToken);
    setCookie(response, tokens.access);
    return {
      refreshToken: tokens.refresh,
    };
  }
  @Throttle({
    default: { limit: +BRUTE_FORCE_WHOAMI_LIMIT, ttl: +BRUTE_FORCE_WHOAMI_TTL },
  })
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
    throw new HttpException(errorMessage.BadRequest, HttpStatus.BAD_REQUEST);
  }
}
