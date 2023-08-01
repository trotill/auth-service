import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from '../db/models/users.model';
import { SessionsModel } from '../db/models/sessions.model';

@Module({
  imports: [SequelizeModule.forFeature([UsersModel, SessionsModel])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
