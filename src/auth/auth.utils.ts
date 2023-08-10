import { ACCESS_TOKEN_COOKIE_NAME } from 'src/utils/const';
import type { JwtTokenPayload } from './auth.types';
import { verify } from 'jsonwebtoken';

export function setCookie(response: Response, value: string) {
  if ('cookie' in response) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    response.cookie(ACCESS_TOKEN_COOKIE_NAME, value, {
      httpOnly: true,
    });
  }
}

export async function verifyToken(
  token: string,
  publicKey: string,
): Promise<JwtTokenPayload> {
  return new Promise((resolve, reject) => {
    verify(token, publicKey, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded as JwtTokenPayload);
    });
  });
}
