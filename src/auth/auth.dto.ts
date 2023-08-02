import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { UserLogin } from '../users/users.dto';
import { DEFAULT_SESSION_ID } from '../utils/const';
import { IsNotEmpty, IsString } from 'class-validator';

export class SessionId {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: DEFAULT_SESSION_ID,
    default: DEFAULT_SESSION_ID,
    description: 'ID сессии',
    required: false,
  })
  readonly sessionId: string;
}

export class LoginParams extends IntersectionType(UserLogin, SessionId) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '3ZRwlSi7HIPQjzCI1AQ/R0KJH08=',
    description:
      'Пароль+логин в md5 (в примере логин - admin пароль - 12345678 md5sum(admin12345678))',
    type: String,
    required: true,
  })
  readonly password: string;
}
export class JWT_Refresh {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'refresh токен',
    required: true,
  })
  readonly refreshToken: string;
}

export class AuthSessions extends UserLogin {
  readonly id: number;
  readonly sessionId: string;
  readonly refreshToken: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
