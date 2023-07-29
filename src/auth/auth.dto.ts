import { ApiProperty } from '@nestjs/swagger';
import { UserLogin } from '../users/users.dto';

export class AuthLoginDto {
  @ApiProperty({
    example: 'admin',
    description: 'Логин',
  })
  login: string;
}

export class LoginParams extends UserLogin {
  @ApiProperty({
    example: '3a4ebf16a4795ad258e5408bae7be341',
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
export class JWT_Pair extends JWT_Refresh {
  @ApiProperty({
    description: 'access токен',
  })
  accessToken: string;
}
