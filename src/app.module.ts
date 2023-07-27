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

@Module({
  imports: [
    UsersModule,
    AuthModule,
    SequelizeModule.forRoot(sequelizeConfig['development']),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
