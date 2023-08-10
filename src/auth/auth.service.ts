import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginParams } from './auth.dto';
import { UserItem, UserRoles } from 'src/users/users.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from 'src/db/models/users.model';
import {
  ACCESS_TIMEOUT,
  DEFAULT_SESSION_ID,
  REFRESH_TIMEOUT,
} from 'src/utils/const';
import { SessionsModel } from 'src/db/models/sessions.model';
import { sign } from 'jsonwebtoken';
import jwtKeys from 'src/utils/keys';
import { errorMessage } from 'src/utils/error';
import { verifyToken } from './auth.utils';
import type { JwtPair } from './auth.types';

@Injectable()
export class AuthService {
  privateKey: string;
  publicKey: string;
  constructor(
    @InjectModel(UsersModel) private userRepository: typeof UsersModel,
    @InjectModel(SessionsModel) private sessionRepository: typeof SessionsModel,
  ) {
    const { privateKey, publicKey } = jwtKeys.keys;
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }
  regenJwtPairByLogin({
    login,
    role = UserRoles.guest,
    sessionId = DEFAULT_SESSION_ID,
  }: {
    login: string;
    role: string;
    sessionId: string;
  }): JwtPair {
    const accessToken = sign(
      { login, role, sessionId, type: 'access' },
      this.privateKey,
      { algorithm: 'RS256', expiresIn: ACCESS_TIMEOUT },
    );
    const refreshToken = sign(
      { login, role, sessionId, type: 'refresh' },
      this.privateKey,
      { algorithm: 'RS256', expiresIn: REFRESH_TIMEOUT },
    );
    return {
      access: accessToken,
      refresh: refreshToken,
    };
  }
  async login(params: LoginParams): Promise<JwtPair> {
    const { login, password, sessionId = DEFAULT_SESSION_ID } = params;
    const user = await this.userRepository.findOne({
      raw: true,
      where: { login },
    });
    if (!user)
      throw new HttpException(errorMessage.UserNotFound, HttpStatus.FORBIDDEN);
    if (user.locked) {
      throw new HttpException(errorMessage.UserLocked, HttpStatus.FORBIDDEN);
    }
    const { sessionId: sid } =
      (await this.sessionRepository.findOne({
        raw: true,
        where: { login, sessionId },
      })) ?? {};
    if (user.password === password) {
      const tokens = this.regenJwtPairByLogin({
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
          sessionId,
          login,
        });
      }
      return tokens;
    }
    //Если пароли не совпадают, исключение
    throw new HttpException(
      errorMessage.IncorrectLoginPassword,
      HttpStatus.BAD_REQUEST,
    );
  }
  async logout(login: string): Promise<number> {
    return this.sessionRepository.destroy({ where: { login } });
  }

  async refresh(refreshToken: string): Promise<JwtPair> {
    const check = await verifyToken(refreshToken, this.publicKey).catch(() => {
      throw new HttpException(
        errorMessage.RefreshTokenError,
        HttpStatus.BAD_REQUEST,
      );
    });
    const user = await this.userRepository.findOne({
      raw: true,
      where: { login: check.login },
    });
    if (!user)
      throw new HttpException(
        errorMessage.UserNotFound,
        HttpStatus.BAD_REQUEST,
      );
    if (user.locked) {
      throw new HttpException(errorMessage.UserLocked, HttpStatus.FORBIDDEN);
    }
    const session = await this.sessionRepository.findOne({
      raw: true,
      where: { refreshToken, login: check.login, sessionId: check.sessionId },
    });
    if (session) {
      const { login, sessionId } = session;
      const pair = this.regenJwtPairByLogin({
        login,
        role: check.role,
        sessionId,
      });
      await this.sessionRepository.update(
        { refreshToken: pair.refresh },
        { where: { login, sessionId } },
      );
      return pair;
    }
    //Если сессия отсутствует, исключение
    throw new HttpException(
      errorMessage.SessionNotFound,
      HttpStatus.BAD_REQUEST,
    );
  }
  async getUserInfoByToken(accessToken: string): Promise<UserItem> {
    const { login } = await verifyToken(accessToken, this.publicKey).catch(
      () => {
        throw new HttpException(
          errorMessage.Unauthorized,
          HttpStatus.UNAUTHORIZED,
        );
      },
    );

    const { role, locked, createdAt, updatedAt, lastName, firstName, email } =
      (await this.userRepository.findOne({ where: { login }, raw: true })) ??
      {};
    //Если пользователя не существует, исключение
    if (!role)
      throw new HttpException(
        errorMessage.UserNotFound,
        HttpStatus.BAD_REQUEST,
      );

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
