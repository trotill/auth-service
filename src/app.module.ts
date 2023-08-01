import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot({
  envFilePath: `.env`,
});
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import * as sequelizeConfig from './db/config/config.js';
import { SessionsModel } from 'src/db/models/sessions.model';
import { UsersModel } from 'src/db/models/users.model';

const models = [UsersModel, SessionsModel];
@Module({
  imports: [
    UsersModule,
    AuthModule,
    SequelizeModule.forRoot({ ...sequelizeConfig['development'], models }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
