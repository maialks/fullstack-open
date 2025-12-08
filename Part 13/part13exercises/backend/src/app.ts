import { fileURLToPath } from 'url';
import express from 'express';
import path from 'path';
import blogRouter from './controllers/blog.js';
import userRouter from './controllers/user.js';
import authRouter from './controllers/auth.js';
import readinglistsRouter from './controllers/readinglists.js';
import authorRouter from './controllers/author.js';

import cors from 'cors';
import { errorHandler } from './utils/middlewares.js';
import config from './utils/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'https://bloglistv3.fly.dev',
];

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      console.log(origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('origin not allowed'));
      }
    },
  })
);
app.use('/api/authors', authorRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/readinglists', readinglistsRouter);

app.use(
  express.static(
    path.join(__dirname, config.NODE_ENV === 'development' ? '../public' : './public')
  )
);
app.get(/.*/, (request, response, next) => {
  if (request.path.startsWith('/api')) return next();
  response.redirect('/');
});

app.use(errorHandler);

export default app;
