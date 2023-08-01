import * as process from 'process';

export const {
  KEY_PATH = './',
  ACCESS_TIMEOUT = '60s',
  REFRESH_TIMEOUT = '90d',
} = process.env;
export const DEFAULT_SESSION_ID = '-';
export const ACCESS_TOKEN_COOKIE_NAME = 'access';
export const IGNORE_CHECK_TOKEN_ROUTE_LIST = ['/auth/login', '/auth/refresh'];