import Blog from './models/Blog.js';
import { type Request } from 'express';

export interface SequelizeValidationError {
  name: 'SequelizeValidationError';
  message: string;
}

export interface UserI {
  id: number;
  username: string;
  name: string;
  password: string;
}

export interface BlogI {
  id: number;
  author: string | null;
  url: string;
  title: string;
  likes: number;
  publiserId: number | null;
}

export type TokenPayload = {
  id: string;
  username: string;
  name: string;
  rawToken: string;
  iat: number;
};

export type RequestWithBlogAndToken = Request & {
  params: { id: string };
  blog: (Blog & { likes: number }) | null;
  decodedToken?: TokenPayload;
};

export type RequestWithToken = Request & {
  params: { id: string };
  decodedToken: TokenPayload;
};
