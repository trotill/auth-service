import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot({
  envFilePath: `.env`,
});
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import * as sequelizeConfig from './db/config/config.js';
import { SessionsModel } from 'src/db/models/sessions.model';
import { UsersModel } from 'src/db/models/users.model';
import { APP_GUARD } from '@nestjs/core';
import { JwtGlobalGuard } from './guard/jwtGlobalGuard';
import { RoleGlobalGuard } from './guard/roleGlobalGuard';

const models = [UsersModel, SessionsModel];
@Module({
  imports: [
    UsersModule,
    AuthModule,
    SequelizeModule.forRoot({ ...sequelizeConfig['development'], models }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtGlobalGuard },
    {
      provide: APP_GUARD,
      useClass: RoleGlobalGuard,
    },
  ],
})
export class AppModule {}
