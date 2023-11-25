import { hash, compare } from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { User } from '../entities/user.js';
import createDebug from 'debug';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('SKINS:skins:router');
debug('Imported');

export type TokenPayload = {
  id: User['id'];
  email: string;
} & jwt.JwtPayload;
export abstract class Auth {
  static secret = process.env.JWT_SECRET;
  static hash(value: string): Promise<string> {
    const saltRound = 10;
    return hash(value, saltRound);
  }

  static compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash);
  }

  static signJWT(payload: TokenPayload) {
    return jwt.sign(payload, Auth.secret!);
  }

  static verifyAndGetPayload(token: string) {
    try {
      const result = jwt.verify(token, Auth.secret!);
      if (typeof result === 'string')
        throw new HttpError(498, 'Invalid token', result);
      return result as TokenPayload;
    } catch (error) {
      throw new HttpError(498, 'Invalid token', (error as Error).message);
    }
  }
}
