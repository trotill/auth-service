import { ACCESS_TOKEN_COOKIE_NAME } from '../utils/const';

export function setCookie(response: Response, value: string) {
  if ('cookie' in response) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    response.cookie(ACCESS_TOKEN_COOKIE_NAME, value, {
      httpOnly: true,
    });
  }
}
