import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from '../db/models/users.model';
import { SessionsModel } from '../db/models/sessions.model';

@Module({
  imports: [SequelizeModule.forFeature([UsersModel, SessionsModel])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
