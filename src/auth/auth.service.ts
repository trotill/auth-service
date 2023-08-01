import { Injectable, OnModuleInit } from '@nestjs/common';
import { LoginParams } from './auth.dto';
import { UserItem, UserLogin, UserRoles } from '../users/users.dto';
import { getKeyPairs } from '../utils/secure';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from '../db/models/users.model';
import {
  ACCESS_TIMEOUT,
  DEFAULT_SESSION_ID,
  REFRESH_TIMEOUT,
} from '../utils/const';
import { SessionsModel } from '../db/models/sessions.model';
import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';

@Injectable()
export class AuthService implements OnModuleInit {
  privateKey: string;
  publicKey: string;
  constructor(
    @InjectModel(UsersModel) private userRepository: typeof UsersModel,
    @InjectModel(SessionsModel) private sessionRepository: typeof SessionsModel,
  ) {}
  async onModuleInit() {
    const keys = await getKeyPairs();
    this.privateKey = keys.privateKey;
    this.publicKey = keys.publicKey;
  }
  async regenJwtPairByLogin({
    login,
    role = UserRoles.guest,
    sessionId = DEFAULT_SESSION_ID,
  }: {
    login: string;
    role: string;
    sessionId: string;
  }) {
    const accessToken = jwt.sign(
      { login, role, sessionId, type: 'access' },
      this.privateKey,
      { algorithm: 'RS256', expiresIn: ACCESS_TIMEOUT },
    );
    const refreshToken = jwt.sign(
      { login, role, sessionId, type: 'refresh' },
      this.privateKey,
      { algorithm: 'RS256', expiresIn: REFRESH_TIMEOUT },
    );
    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }
  async login(params: LoginParams) {
    const { login, password, sessionId = DEFAULT_SESSION_ID } = params;
    //ToDo разрбраться с отношениями, делать один запрос вместо 2х
    const user = await this.userRepository.findOne({
      raw: true,
      where: { login },
      /*  include: {
        model: SessionsModel,
        attributes: [],
        where: {
          sessionId,
        },
      },*/
    });
    const { sessionId: sid } =
      (await this.sessionRepository.findOne({
        raw: true,
        where: { login },
      })) ?? {};
    if (user?.password === password) {
      const tokens = await this.regenJwtPairByLogin({
        login,
        role: user.role as string,
        sessionId,
      });
      if (sid) {
        await this.sessionRepository.update(
          { refreshToken: tokens.refresh },
          { where: { sessionId: sid } },
        );
      } else {
        await this.sessionRepository.create({
          refreshToken: tokens.refresh,
          sessionId: sid,
          login,
        });
      }
      return tokens;
    }
    throw new Error();
  }
  async logout(login: string) {
    //ToDo переделать на каскадное удаление
    await this.sessionRepository.destroy({ where: { login } });
    await this.userRepository.destroy({ where: { login } });
  }
  get verify() {
    return promisify(jwt.verify);
  }
  async refresh(refreshToken: string) {
    const check = await this.verify(refreshToken, this.publicKey);
    const session = await this.sessionRepository.findOne({
      raw: true,
      where: { refreshToken },
    });
    if (session) {
      const tokens = await this.regenJwtPairByLogin({
        login: session.login,
        role: check.role,
        sessionId: session.sessionId,
      });
      return tokens;
    }
    throw new Error();
  }
  async getUserInfoByToken(accessToken: string): Promise<UserItem> {
    const { login } = await this.verify(accessToken, this.publicKey);
    const { role, locked, createdAt, updatedAt, lastName, firstName, email } =
      await this.userRepository.findOne({ where: { login }, raw: true });
    return {
      login,
      role: role as UserRoles,
      locked,
      firstName,
      lastName,
      email,
      createdAt,
      updatedAt,
    };
  }
}
