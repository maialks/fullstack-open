import express from 'express';
import { User } from '../models/index.js';
const authRouter = express.Router();
import bcrypt from 'bcrypt';
import config from '../utils/config.js';
import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';
import { getAuth } from '../utils/middlewares.js';
import type { RequestWithToken } from '../types.js';

const SESSION_TTL = [24, '24h'] as const;

authRouter.post('/', async (request, response) => {
  const user = await User.scope('withPassword').findOne({
    where: { username: request.body.username },
  });
  console.log(request.body);
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(request.body.password, user.password);

  if (!passwordCorrect || !user)
    return response.status(401).json({ error: 'invalid username or password' });

  const userData = { id: user.id, name: user.name, username: user.username };

  const now = Date.now();
  const expiresAt = new Date(now + SESSION_TTL[0] * 60 * 60 * 1000);
  const token = jwt.sign(userData, config.JWT_SECRET, { expiresIn: SESSION_TTL[1] });

  await Session.create({
    user_id: user.id,
    token,
    expires_at: expiresAt,
  });

  return response.status(200).send(token);
});

authRouter.delete('/logout', getAuth, async (request, response) => {
  const decodedToken = (request as RequestWithToken).decodedToken;
  await Session.destroy({
    where: {
      token: decodedToken.rawToken,
    },
  });
  response.status(204).send();
});

export default authRouter;
