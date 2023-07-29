import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { UserCreate } from '../../users/users.dto';

@Table({ tableName: 'users' })
export class UsersModel extends Model<UsersModel, UserCreate> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
  })
  login: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  role: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  firstName: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  lastName: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: '',
  })
  email: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: false,
  })
  locked: boolean;
}
