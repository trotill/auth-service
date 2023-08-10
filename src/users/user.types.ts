import { JwtValidate } from '../jwt/jwt.types';

export interface RequestWU extends Request {
  user: JwtValidate;
}
