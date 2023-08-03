import * as process from 'process';

export const {
  KEY_PATH = process.env.STORE_PATH,
  ACCESS_TIMEOUT = '60s',
  REFRESH_TIMEOUT = '90d',
} = process.env;
export const DEFAULT_SESSION_ID = '-';
export const ACCESS_TOKEN_COOKIE_NAME = 'access';
