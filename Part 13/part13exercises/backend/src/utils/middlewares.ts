import { type RequestHandler, type NextFunction, type Request, type Response } from 'express';
import type { TokenPayload, RequestWithToken } from '../types.js';
import { isSequelizeValidationError } from '../typeguards.js';
import jwt from 'jsonwebtoken';
import config from './config.js';
import Session from '../models/Session.js';

export const getAuth: RequestHandler = async (request, response, next) => {
  const authHeader = request.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return response.status(401).json({ error: 'invalid or expired token' });
  const rawToken = authHeader.replace('Bearer ', '');

  // Here we have a few strategies to keep the database in sync:
  //
  // 1. Regardless of what jwt.verify returns, always check token validity
  //    directly in the database.
  //       pros: invalid tokens are removed as soon as they are used.
  //       cons: unnecessary database load; tokens that we already know are
  //             invalid will still generate queries, increasing cost and
  //             exposing the backend to attacks like DDOS.
  //
  // 2. (our choice) First verify the token with jwt. If it is invalid or
  //    expired at the JWT level, immediately return 401. Only when the
  //    token is valid and not expired do we check it in the sessions table.
  //       pros: significantly fewer database queries, reducing load and cost.
  //       cons: requires a cleanup job such as:
  //             DELETE FROM sessions WHERE expires_at <= NOW();
  //             to keep the database updated.

  let decodedToken: TokenPayload;
  try {
    decodedToken = jwt.verify(rawToken, config.JWT_SECRET) as TokenPayload;
  } catch (err) {
    return response.status(401).json({ error: 'invalid or expired token' });
  }

  const tokenActive = await Session.validateTokenState(rawToken);
  if (!tokenActive) return response.status(401).json({ error: 'invalid or expired token' });

  (request as RequestWithToken).decodedToken! = { ...decodedToken, rawToken };
  return next();
};

export const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  console.error(error);
  if (isSequelizeValidationError(error))
    return response.status(400).json({ error: error.message });
  return response.status(500).json({ error: 'Internal server error' });
};
