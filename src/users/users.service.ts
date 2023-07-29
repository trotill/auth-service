import { Injectable } from '@nestjs/common';
import { GetAllParam, UserCreate, UserList } from './users.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from '../db/models/users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel) private userRepository: typeof UsersModel,
  ) {}
  async getAll(body: GetAllParam): Promise<UserList> {
    return {
      items: [],
      count: 0,
    };
  }
  async delete(login: string) {}
  async update(login: string, param: UserCreate) {}
  async create(param: UserCreate) {
    return '0';
  }
}
