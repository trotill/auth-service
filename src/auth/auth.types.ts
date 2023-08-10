export interface JwtTokenPayload {
  login: string;
  role: string;
  sessionId: string;
  type: string;
  iat: number;
  exp: number;
}

export interface JwtPair {
  access: string;
  refresh: string;
}
