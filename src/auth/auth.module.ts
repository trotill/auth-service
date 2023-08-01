import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from '../db/models/users.model';
import { SessionsModel } from '../db/models/sessions.model';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ACCESS_TIMEOUT } from '../utils/const';
import jwtKeys from '../utils/keys';

@Module({
  imports: [
    SequelizeModule.forFeature([UsersModel, SessionsModel]),
    JwtModule.register({
      secret: jwtKeys.keys.publicKey,
      signOptions: {
        expiresIn: ACCESS_TIMEOUT,
      },
    }),
  ],
  exports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
