import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { Auth } from '../services/auth.js';
import { SkinsMongoRepo } from '../repos/skins.mongo.repo.js';
const debug = createDebug('SKINS:auth:interceptor');

export class AuthInterceptor {
  constructor() {
    debug('Instantiated');
  }

  authorization(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenHeader = req.get('Authorization');
      if (!tokenHeader?.startsWith('Bearer'))
        throw new HttpError(401, 'Unauthorized');
      const token = tokenHeader.split(' ')[1];
      const tokenPayload = Auth.verifyAndGetPayload(token);
      req.body.userId = tokenPayload.id;
      next();
    } catch (error) {
      next(error);
    }
  }

  async authenticationSkins(req: Request, res: Response, next: NextFunction) {
    try {
      const userID = req.body.userId;
      const skinsID = req.params.id;
      const repoSkins = new SkinsMongoRepo();
      const skin = await repoSkins.getById(skinsID);
      if (skin.author.id !== userID)
        throw new HttpError(401, 'Unauthorized', 'User not valid');
      next();
    } catch (error) {
      next(error);
    }
  }
}
