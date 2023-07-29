import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as process from 'process';
import { KEY_PATH } from './const';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';

export const getKeyPairs = async (): Promise<{
  publicKey: string;
  privateKey: string;
}> => {
  if (!existsSync(`${KEY_PATH}/public.key`)) {
    const generateKeyPair = promisify(crypto.generateKeyPair);
    const { publicKey: newPublicKey, privateKey: newPrivateKey } =
      await generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      });
    await writeFile(`${KEY_PATH}/public.key`, newPublicKey);
    await writeFile(`${KEY_PATH}/private.key`, newPrivateKey);
  }
  return {
    publicKey: readFileSync(`${KEY_PATH}/public.key`).toString(),
    privateKey: readFileSync(`${KEY_PATH}/private.key`).toString(),
  };
};

export function test() {
  const privateKey = readFileSync(`${KEY_PATH}/private.key`);
  const publicKey = readFileSync(`${KEY_PATH}/public.key`);
  const token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
  const decoded = jwt.verify(token, publicKey);
  console.log(decoded);
}
