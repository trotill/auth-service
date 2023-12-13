import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { UserLogin } from 'src/users/users.dto';
import { DEFAULT_SESSION_ID } from 'src/utils/const';
import { IsNotEmpty, IsString } from 'class-validator';

export class SessionId {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: DEFAULT_SESSION_ID,
    default: DEFAULT_SESSION_ID,
    description: 'Session ID',
    required: false,
  })
  readonly sessionId: string;
}

export class LoginParams extends IntersectionType(UserLogin, SessionId) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2CSU8F1pF7oC96qilonMtES7c/IDgIdssF0fN1N7eJI=',
    description:
      'Password + login in md5 (in the example login - admin password - 12345678 md5sum(admin12345678))',
    type: String,
    required: true,
  })
  readonly password: string;
}
export class LogoutParams extends IntersectionType(UserLogin, SessionId) {}
export class JWT_Refresh {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Refresh token',
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
