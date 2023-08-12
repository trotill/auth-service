import { Injectable } from '@nestjs/common';
import {
  GetAllParam,
  UserCreate,
  UserItem,
  UserList,
  UserUpdate,
} from './users.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from 'src/db/models/users.model';
import { Op } from 'sequelize';
import { SessionsModel } from 'src/db/models/sessions.model';
import { getPasswordHash } from '../utils/secure';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel) private userRepository: typeof UsersModel,
    @InjectModel(SessionsModel) private sessionRepository: typeof SessionsModel,
  ) {}
  async getAll(query: GetAllParam): Promise<UserList> {
    const { limit, offset, sort, order, search } = query;
    const or = search
      ? {
          firstName: {
            [Op.like]: `%${search}%`,
          },
          lastName: {
            [Op.like]: `%${search}%`,
          },
          login: {
            [Op.like]: `%${search}%`,
          },
          email: {
            [Op.like]: `%${search}%`,
          },
        }
      : undefined;
    const where = or
      ? {
          [Op.or]: or,
        }
      : undefined;
    const data = await this.userRepository.findAndCountAll({
      raw: true,
      where,
      limit,
      offset,
      order: sort && order ? [[sort, order]] : undefined,
    });
    return {
      items: data.rows as UserItem[],
      count: data.count,
    };
  }
  async delete(login: string): Promise<number> {
    await this.sessionRepository.destroy({ where: { login } });
    return this.userRepository.destroy({ where: { login } });
  }
  async update(
    login: string,
    { password, ...param }: UserUpdate,
  ): Promise<[number]> {
    return this.userRepository.update(
      {
        ...param,
        password: password ? getPasswordHash(password) : undefined,
      },
      { where: { login } },
    );
  }
  async create({ password, ...param }: UserCreate): Promise<UsersModel> {
    return this.userRepository.create({
      ...param,
      password: getPasswordHash(password),
    });
  }
}
