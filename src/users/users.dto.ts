import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

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
    description: 'Login',
    required: true,
  })
  readonly login: string;
}
export class UserBase extends UserLogin {
  @IsString()
  @ApiProperty({
    example: 'Ivan',
    description: 'First name',
    required: true,
  })
  readonly firstName: string;
  @IsString()
  @ApiProperty({
    example: 'Ivanov',
    description: 'Last name',
    required: true,
  })
  readonly lastName: string;
  @IsString()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Mail',
  })
  readonly email: string;
  @IsString()
  @ApiProperty({
    example: UserRoles.admin,
    description: 'Role',
    enum: UserRoles,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn([UserRoles.admin, UserRoles.operator, UserRoles.guest])
  readonly role: UserRoles;

  @ApiProperty({
    example: 0,
    description: 'Locked - 1/unlocked - 0',
    type: 'integer',
    format: 'int32',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  readonly locked: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '384633ad37a18b3b4fc5bf3e371d6e9f',
    description: 'Password + login in md5',
    type: String,
    required: false,
  })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Creation time',
    type: Date,
    required: false,
  })
  readonly createdAt: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Update time',
    type: Date,
    required: false,
  })
  readonly updatedAt: string;
}

export class UserCreate extends OmitType(UserBase, ['updatedAt', 'createdAt']) {
  @ApiProperty({
    required: true,
  })
  readonly password: string;
}
export class UserUpdate extends PartialType(
  OmitType(UserCreate, ['login'] as const),
) {}
export class UserItem extends OmitType(UserBase, ['password'] as const) {}

export class UserList {
  @ApiProperty({
    example: [],
    description: 'User list',
    type: UserItem,
    isArray: true,
  })
  items: Array<UserItem>;
  @ApiProperty({
    example: 0,
    description: 'Total users match the filter',
    type: 'integer',
    format: 'int32',
  })
  count: number;
}

export class GetAllParam {
  @ApiProperty({
    example: 200000,
    default: 200000,
    description: 'Limit',
    type: 'integer',
    format: 'int32',
    minimum: 1,
    required: true,
  })
  @Transform(({ value }: TransformFnParams): number => +value)
  @IsNotEmpty()
  limit: number;

  @ApiProperty({
    example: 0,
    default: 0,
    description: 'Offset',
    type: 'integer',
    format: 'int32',
    minimum: 0,
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams): number => +value)
  offset: number;

  @ApiProperty({
    description: 'Sort Column',
    default: 'login',
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  sort: string;

  @ApiProperty({
    description: 'Sorting. Direction. "ASC" - direct, "DESC" - reverse.',
    default: SORT_ORDERS[0],
    enum: SORT_ORDERS,
    required: false,
  })
  @IsOptional()
  @IsIn(SORT_ORDERS)
  order: string;

  @ApiProperty({
    description: 'Search string. Search by first name, last name, email',
    example: '',
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  search: string;
}

export class RegisterUser extends OmitType(UserCreate, ['locked', 'role']) {}
