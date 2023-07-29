import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export const SORT_ORDERS = ['ASC', 'DESC'];

export enum UserRoles {
  admin = 'admin',
  operator = 'operator',
}
export class UserLogin {
  @ApiProperty({
    example: 'admin',
    description: 'логин',
  })
  login: string;
}
export class UserCreate extends UserLogin {
  @ApiProperty({
    example: 'Иван',
    description: 'имя',
    required: true,
  })
  firstName: string;
  @ApiProperty({
    example: 'Иванов',
    description: 'фамилия',
    required: true,
  })
  lastName: string;
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Почта',
  })
  email: string;
  @ApiProperty({
    example: UserRoles.admin,
    description: 'роль',
    enum: UserRoles,
    required: true,
  })
  role: UserRoles;
  @ApiProperty({
    example: 1,
    description: 'Заблокирован - true/ разблокирован - false',
    type: Boolean,
    required: true,
  })
  locked: boolean;
  @ApiProperty({
    example: '384633ad37a18b3b4fc5bf3e371d6e9f',
    description: 'Пароль+логин в md5',
    type: String,
    required: false,
  })
  password: string;
  @ApiProperty({
    description: 'Время создания',
    type: String,
    required: false,
  })
  createdAt: string;
  @ApiProperty({
    description: 'Время обновления',
    type: String,
    required: false,
  })
  updatedAt: string;
}

export class UserItem extends OmitType(UserCreate, ['password'] as const) {}

export class UserList {
  @ApiProperty({
    example: [],
    description: 'Список пользователей',
    type: UserItem,
    isArray: true,
  })
  items: Array<UserItem>;
  @ApiProperty({
    example: 0,
    description: 'Всего пользователей соответсвуют фильтру',
    type: Number,
  })
  count: number;
}

export class GetAllParam {
  @ApiProperty({
    example: 0,
    default: 200000,
    description: 'Лимит',
    type: Number,
    minimum: 1,
    required: true,
  })
  @IsInt()
  @IsPositive()
  limit: number;

  @ApiProperty({
    example: 0,
    default: 0,
    description: 'Смещение',
    type: Number,
    minimum: 0,
    required: true,
  })
  @IsInt()
  @IsPositive()
  offset: number;

  @ApiProperty({
    description: 'Столбец сортировки',
    default: 'login',
    required: false,
  })
  @IsOptional()
  sort: string;

  @ApiProperty({
    description: 'Сортировка. Направление. "ASC" - прямое, "DESC" - обратное.',
    default: SORT_ORDERS[0],
    enum: SORT_ORDERS,
    required: false,
  })
  @IsOptional()
  @IsIn(SORT_ORDERS)
  order: string;
}
