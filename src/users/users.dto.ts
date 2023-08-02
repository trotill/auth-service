import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNumeric } from 'sequelize-typescript';

export const SORT_ORDERS = ['ASC', 'DESC'];

export enum UserRoles {
  admin = 'admin',
  operator = 'operator',
  guest = 'guest',
}
export class UserLogin {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'admin',
    description: 'логин',
    required: true,
  })
  readonly login: string;
}
export class UserBase extends UserLogin {
  @IsString()
  @ApiProperty({
    example: 'Иван',
    description: 'имя',
    required: true,
  })
  readonly firstName: string;
  @IsString()
  @ApiProperty({
    example: 'Иванов',
    description: 'фамилия',
    required: true,
  })
  readonly lastName: string;
  @IsString()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Почта',
  })
  readonly email: string;
  @IsString()
  @ApiProperty({
    example: UserRoles.admin,
    description: 'роль',
    enum: UserRoles,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn([UserRoles.admin, UserRoles.operator, UserRoles.guest])
  readonly role: UserRoles;

  @ApiProperty({
    example: true,
    description: 'Заблокирован - true/ разблокирован - false',
    type: Boolean,
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  readonly locked: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '384633ad37a18b3b4fc5bf3e371d6e9f',
    description: 'Пароль+логин в md5',
    type: String,
    required: false,
  })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Время создания',
    type: Date,
    required: false,
  })
  readonly createdAt: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Время обновления',
    type: Date,
    required: false,
  })
  readonly updatedAt: string;
}

export class UserCreate extends OmitType(UserBase, [
  'updatedAt',
  'createdAt',
]) {}
export class UserUpdate extends PartialType(
  OmitType(UserCreate, ['login'] as const),
) {}
export class UserItem extends OmitType(UserBase, ['password'] as const) {}

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
    example: 200000,
    default: 200000,
    description: 'Лимит',
    type: Number,
    minimum: 1,
    required: true,
  })
  @Transform(({ value }: TransformFnParams): number => +value)
  @IsNotEmpty()
  limit: number;

  @ApiProperty({
    example: 0,
    default: 0,
    description: 'Смещение',
    type: Number,
    minimum: 0,
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams): number => +value)
  offset: number;

  @ApiProperty({
    description: 'Столбец сортировки',
    default: 'login',
    required: false,
  })
  @IsNotEmpty()
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

  @ApiProperty({
    description: 'Поисковая строка. Поиск по имени, фамилии, email',
    example: '',
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  search: string;
}
