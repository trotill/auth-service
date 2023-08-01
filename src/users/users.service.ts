import { Injectable } from '@nestjs/common';
import {
  GetAllParam,
  UserBase,
  UserCreate,
  UserItem,
  UserList,
  UserUpdate,
} from './users.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from '../db/models/users.model';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel) private userRepository: typeof UsersModel,
  ) {}
  async getAll(query: GetAllParam): Promise<UserList> {
    const { limit, offset, sort, order, search } = query;
    const search1 = undefined;
    const or = search
      ? {
          //name: { [Op.iLike]: `%${nameContains.trim()}%` }
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
  async delete(login: string) {
    return this.userRepository.destroy({ where: { login } });
  }
  async update(login: string, param: UserUpdate) {
    return this.userRepository.update(param, { where: { login } });
  }
  async create(param: UserCreate) {
    return this.userRepository.create(param);
  }
}
