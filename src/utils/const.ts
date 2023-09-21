import * as process from 'process';

export const {
  KEY_PATH = process.env.STORE_PATH,
  ACCESS_TIMEOUT = '60s',
  REFRESH_TIMEOUT = '90d',
  SAVE_SWAGGER = '0',
  ALLOW_USER_REGISTRATION = '0',
  DENY_GET_USER_LIST = '0',
  BRUTE_FORCE_LOGIN_DELAY = '2000',
} = process.env;
export const DEFAULT_SESSION_ID = '-';
export const ACCESS_TOKEN_COOKIE_NAME = 'access';
export const CHECK_SESSION_TOKEN_INTERVAL = 86400;
