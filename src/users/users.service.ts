import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  GetAllParam,
  RegisterUser,
  UserCreate,
  UserItem,
  UserList,
  UserRoles,
  UserUpdate,
} from 'src/users/users.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from 'src/db/models/users.model';
import { Op } from 'sequelize';
import { SessionsModel } from 'src/db/models/sessions.model';
import { getPasswordHash } from 'src/utils/jsutils.cjs';
import { errorMessage } from 'src/utils/error';
import { DENY_ADMIN_CHANGE_ADMIN } from 'src/utils/const';

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
      attributes: { exclude: ['password'] },
      order: sort && order ? [[sort, order]] : undefined,
    });

    return {
      items: data.rows as UserItem[],
      count: data.count,
    };
  }
  async getUser(login: string): Promise<UsersModel> {
    const userInfo = await this.userRepository.findOne({
      where: { login },
      raw: true,
    });
    if (!userInfo)
      throw new HttpException(
        errorMessage.UserNotFound,
        HttpStatus.BAD_REQUEST,
      );
    return userInfo;
  }
  async delete(login: string): Promise<number> {
    const user = await this.getUser(login);
    if (+DENY_ADMIN_CHANGE_ADMIN && user.role === UserRoles.admin) {
      throw new ForbiddenException();
    }
    await this.sessionRepository.destroy({ where: { login } });
    return this.userRepository.destroy({ where: { login } });
  }
  async update(
    login: string,
    { password, ...param }: UserUpdate,
    tokenLogin: string,
  ): Promise<[number]> {
    const userInfo = await this.getUser(login);
    if (+DENY_ADMIN_CHANGE_ADMIN && userInfo.role === UserRoles.admin) {
      const blockChangeLock =
        param.locked !== undefined ? userInfo.locked !== param.locked : false;
      const byMyself = tokenLogin === login;
      const blockChangePassword =
        password !== undefined && !byMyself
          ? userInfo.password !== getPasswordHash(password)
          : false;
      if (blockChangeLock || blockChangePassword)
        throw new ForbiddenException();
    }
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
  async register(registerParams: RegisterUser) {
    const { login } =
      (await this.userRepository.findOne({
        where: { login: registerParams.login },
        raw: true,
      })) ?? {};
    if (login === registerParams.login) {
      throw new HttpException(
        errorMessage.NotAcceptable,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return this.create({ ...registerParams, locked: 1, role: UserRoles.guest });
  }
}
