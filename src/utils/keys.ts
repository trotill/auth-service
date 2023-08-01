import { getKeyPairs } from './secure';

class JwtKeys {
  private privateKey: string;
  private publicKey: string;
  async init() {
    const { privateKey, publicKey } = await getKeyPairs();
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }
  get keys() {
    return {
      privateKey: this.privateKey,
      publicKey: this.publicKey,
    };
  }
}

const jwtKeys = new JwtKeys();
export default jwtKeys;
