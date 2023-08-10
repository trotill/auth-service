import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { AuthSessions } from 'src/auth/auth.dto';
import { DEFAULT_SESSION_ID } from 'src/utils/const';

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
    defaultValue: DEFAULT_SESSION_ID,
  })
  sessionId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refreshToken: string;
}
