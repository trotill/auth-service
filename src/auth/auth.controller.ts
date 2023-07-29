import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWT_Pair, JWT_Refresh, LoginParams } from './auth.dto';
import { UserItem, UserList, UserLogin } from '../users/users.dto';
import { AuthService } from './auth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({ summary: 'Залогиниться' })
  @ApiResponse({ status: 200, type: JWT_Pair })
  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginParams) {
    return this.authService.login(body);
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
  @Post('refresh')
  async refresh(@Body() { refreshToken }: JWT_Refresh) {
    return this.authService.refresh(refreshToken);
  }
  @ApiOperation({ summary: 'Получить информацию о пользователе по токену' })
  @ApiResponse({ status: 200, type: UserItem })
  @Get()
  async whoAmi(): Promise<UserItem> {
    const login = 'admin';
    return this.authService.getUserInfo(login);
  }
}
