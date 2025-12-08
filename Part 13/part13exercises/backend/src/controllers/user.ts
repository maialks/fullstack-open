import express from 'express';
import { User, Blog } from '../models/index.js';
import type { UserI } from '../types.js';
import { sequelize } from '../utils/database.js';
import { QueryTypes } from 'sequelize';
import bcrypt from 'bcrypt';
const usersRouter = express.Router();

usersRouter.get('/', async (_request, response) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      as: 'blogs',
      attributes: ['id', 'title', 'author', 'likes', 'url'],
    },
  });
  response.json(users);
});

usersRouter.get('/raw', async (_request, response) => {
  const users = await sequelize.query(
    `
      SELECT 
        u.id,
        u.username,
        u.name,
        b.id AS blogs_id,
        b.title AS blogs_title,
        b.author AS blogs_author,
        b.likes AS blogs_likes,
        b.url AS blogs_url
      FROM users AS u
      LEFT OUTER JOIN blogs AS b
        ON u.id = b.publisher_id;
    `,
    {
      type: QueryTypes.SELECT,
    }
  );
  response.json(users);
});

usersRouter.get('/raw/:id', async (request, response) => {
  let readFilter: null | boolean = null;
  if (request.query.read !== undefined) {
    switch (request.query.read) {
      case 'true':
        readFilter = true;
        break;
      case 'false':
        readFilter = false;
        break;
      default:
        return response.status(400).json({
          error: 'Invalid value for "read" query parameter. Must be "true" or "false".',
        });
    }
  }

  const result: Record<string, unknown>[] = await sequelize.query(
    `
    WITH user_base AS (
      SELECT
        id,
        username,
        name,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
    ),
    published AS (
      SELECT
        publisher_id AS user_id,
        json_agg(
          json_build_object(
            'id',     b.id,
            'title',  b.title,
            'author', b.author,
            'likes',  b.likes,
            'url',    b.url
          )
          ORDER BY b.id
        ) AS publishedBlogs
      FROM blogs b
      WHERE b.publisher_id = $1
      GROUP BY publisher_id
    ),
    readings AS (
      SELECT
        rl.user_id,
        json_agg(
          json_build_object(
            'id',          b.id,
            'title',       b.title,
            'author',      b.author,
            'likes',       b.likes,
            'url',         b.url,
            'readings',    json_build_object (
              'read_id', rl.id,
              'read_status', rl.status_read
            )
          )
          ORDER BY b.id
        ) AS readings
      FROM reading_list rl
      JOIN blogs b ON b.id = rl.blog_id
      WHERE rl.user_id = $1
        AND ($2::boolean IS NULL OR rl.status_read = $2::boolean)
      GROUP BY rl.user_id
    )
    SELECT json_build_object(
      'id',             u.id,
      'username',       u.username,
      'name',           u.name,
      'createdAt',      u.created_at,
      'updatedAt',      u.updated_at,
      'publishedBlogs', COALESCE(p.publishedBlogs, '[]'::json),
      'readings',       COALESCE(r.readings, '[]'::json)
    ) AS user_json
    FROM user_base u
    LEFT JOIN published p ON p.user_id = u.id
    LEFT JOIN readings r ON r.user_id = u.id
    `,
    {
      type: QueryTypes.SELECT,
      bind: [request.params.id, readFilter],
    }
  );

  console.log(result[0]);
  const user = result[0]?.user_json || null;

  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }

  response.json(user);
});

usersRouter.get('/:id', async (request, response) => {
  let readFilter: null | boolean = null;
  if (request.query.read !== undefined) {
    switch (request.query.read) {
      case 'true':
        readFilter = true;
        break;
      case 'false':
        readFilter = false;
        break;
      default:
        return response.status(400).json({
          error: 'Invalid value for "read" query parameter. Must be "true" or "false".',
        });
    }
  }

  const user = await User.findByPk(request.params.id, {
    attributes: { exclude: ['passwordHash'] },
    include: [
      {
        model: Blog,
        as: 'publishedBlogs',
        attributes: ['id', 'title', 'author', 'likes', 'url'],
      },
      {
        model: Blog,
        as: 'readings',
        attributes: ['id', 'title', 'author', 'likes', 'url'],
        through: {
          attributes: [['status_read', 'read'], 'id'],
          ...(readFilter === null ? {} : { where: { status_read: readFilter } }),
        },
      },
    ],
  });
  response.json(user);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password: rawPassword } = request.body;
  if (rawPassword.length < 6 || rawPassword.length > 32)
    return response
      .status(400)
      .json({ error: 'password must be between 6 and 32 characters long' });
  const saltRounds = 11;
  const password = await bcrypt.hash(rawPassword, saltRounds);
  await User.create({ username, name, password });
  response.status(201).send();
});

usersRouter.post('/raw', async (request, response) => {
  const { username, name, password: rawPassword } = request.body;
  if (rawPassword.length < 6 || rawPassword.length > 32)
    return response
      .status(400)
      .json({ error: 'password must be between 6 and 32 characters long' });

  if (username.length < 3 || username.length > 12)
    return response
      .status(400)
      .json({ error: 'username must be between 3 and 12 characters long' });

  if (name.length < 3 || name.length > 16)
    return response.status(400).json({ error: 'name must be between 3 and 16 characters long' });

  const saltRounds = 11;
  const password = await bcrypt.hash(rawPassword, saltRounds);
  await sequelize.query('INSERT INTO users (username, name, password) VALUES ($1, $2, $3)', {
    type: QueryTypes.INSERT,
    bind: [username, name, password],
  });
  response.status(201).send();
});

usersRouter.put('/:username', async (request, response) => {
  // o retorno por padrao e [numero de linhas afetadas, array de objetos atualizados]
  const [_, [updated]] = await User.update(
    { username: request.body.username },
    { where: { username: request.params.username }, returning: true }
  );
  if (!updated) return response.status(400).json({ error: 'user not found' });
  return response.json({
    id: (updated as unknown as UserI).id,
    username: (updated as unknown as UserI).username,
    name: (updated as unknown as UserI).name,
  });
});

usersRouter.put('/raw/:username', async (request, response) => {
  const [updated] = await sequelize.query(
    'UPDATE users SET username = $2 WHERE username = $1 RETURNING *',
    { type: QueryTypes.SELECT, bind: [request.params.username, request.body.username] }
  );
  if (!updated) return response.status(400).json({ error: 'user not found' });
  return response.json({
    id: (updated as unknown as UserI).id,
    username: (updated as unknown as UserI).username,
    name: (updated as unknown as UserI).name,
  });
});

export default usersRouter;
