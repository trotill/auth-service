export interface JwtTokenPayload {
  login: string;
  role: string;
  sessionId: string;
  type: string;
  iat: number;
  exp: number;
}
