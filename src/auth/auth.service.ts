import { Injectable, OnModuleInit } from '@nestjs/common';
import { LoginParams } from './auth.dto';
import { UserItem, UserLogin, UserRoles } from '../users/users.dto';
import { getKeyPairs } from '../utils/secure';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from '../db/models/users.model';

@Injectable()
export class AuthService implements OnModuleInit {
  privateKey: string;
  publicKey: string;
  constructor(
    @InjectModel(UsersModel) private userRepository: typeof UsersModel,
  ) {}
  async onModuleInit() {
    const keys = await getKeyPairs();
    this.privateKey = keys.privateKey;
    this.publicKey = keys.publicKey;
  }
  login(params: LoginParams) {}
  logout(login: string) {}
  refresh(refreshToken: string) {}
  async getUserInfo(login: string): Promise<UserItem> {
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
