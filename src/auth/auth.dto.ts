import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { UserLogin } from '../users/users.dto';
import { DEFAULT_SESSION_ID } from '../utils/const';

export class SessionId {
  @ApiProperty({
    example: DEFAULT_SESSION_ID,
    default: DEFAULT_SESSION_ID,
    description: 'ID сессии',
    required: false,
  })
  sessionId: string;
}

export class LoginParams extends IntersectionType(UserLogin, SessionId) {
  @ApiProperty({
    example: '3ZRwlSi7HIPQjzCI1AQ/R0KJH08=',
    description:
      'Пароль+логин в md5 (в примере логин - admin пароль - 12345678 md5sum(admin12345678))',
    type: String,
    required: false,
  })
  password: string;
}
export class JWT_Refresh {
  @ApiProperty({
    description: 'refresh токен',
    required: true,
  })
  refreshToken: string;
}

export class AuthSessions extends UserLogin {
  id: number;
  sessionId: string;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
}
