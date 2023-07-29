import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from '../db/models/users.model';

@Module({
  imports: [SequelizeModule.forFeature([UsersModel])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
