import { getKeyPairs } from './secure';

class JwtKeys {
  private privateKey: string;
  private publicKey: string;
  async init(): Promise<void> {
    const { privateKey, publicKey } = await getKeyPairs();
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }
  get keys(): { privateKey: string; publicKey: string } {
    return {
      privateKey: this.privateKey,
      publicKey: this.publicKey,
    };
  }
}

const jwtKeys = new JwtKeys();
export default jwtKeys;
