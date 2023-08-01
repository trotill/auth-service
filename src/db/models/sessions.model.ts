import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { AuthSessions } from '../../auth/auth.dto';
import { DEFAULT_SESSION_ID } from '../../utils/const';

@Table({ tableName: 'sessions' })
export class SessionsModel extends Model<SessionsModel, AuthSessions> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  login: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    defaultValue: DEFAULT_SESSION_ID,
  })
  sessionId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refreshToken: string;
}
