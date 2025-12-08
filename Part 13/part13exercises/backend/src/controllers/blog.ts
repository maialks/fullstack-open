import express, { type RequestHandler } from 'express';
const blogRouter = express.Router();
import { Blog, User } from '../models/index.js';
import { sequelize } from '../utils/database.js';
import { getAuth } from '../utils/middlewares.js';
import { QueryTypes, Op } from 'sequelize';
import { isBlog } from '../typeguards.js';
import type { RequestWithBlogAndToken } from '../types.js';

// utils
const blogFinder: RequestHandler = async (request, _response, next) => {
  const blog = await Blog.findByPk(request.params.id);
  (request as RequestWithBlogAndToken).blog = blog as Blog & { likes: number };
  next();
};

// usando models
blogRouter.get('/', async (request, response) => {
  const where = {
    [Op.or]: [
      { title: { [Op.iLike]: `%${request.query.search}%` } },
      { author: { [Op.iLike]: `%${request.query.search}%` } },
    ],
  };
  let order: undefined | [[string, string]] = [['likes', 'DESC']]; // default

  if (request.query.order && typeof request.query.order === 'string') {
    const orderQuery = request.query.order.toUpperCase();
    if (['ASC', ' DESC'].includes(orderQuery)) order = [['likes', orderQuery]];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['publisherId'] },
    include: {
      model: User,
      as: 'publisher',
      attributes: ['id', 'username', 'name'],
    },
    ...(request.query.order ? { order } : {}),
    ...(request.query.search ? { where } : {}),
  });
  response.json(blogs);
});

blogRouter.get('/:id', blogFinder, async (request, response) => {
  const { blog } = request as RequestWithBlogAndToken;
  if (!blog) return response.status(404).json({ error: 'blog not found' });
  response.json(blog);
});

blogRouter.post('/', getAuth, async (request, response) => {
  const decodedToken = (request as RequestWithBlogAndToken).decodedToken;
  const blog: unknown = request.body;

  if (!isBlog(blog)) return response.status(400).json({ error: 'bad input' });
  if (!decodedToken) return response.status(401).json({ error: 'authentication not provided' });

  const newBlog = await Blog.create({ ...request.body, publisherId: decodedToken.id });
  response.status(201).json(newBlog);
});

blogRouter.delete('/:id', blogFinder, getAuth, async (request, response) => {
  const { blog, decodedToken } = request as RequestWithBlogAndToken;

  if (blog && decodedToken && blog.dataValues.publisherId === +decodedToken.id) {
    await blog.destroy();
    response.status(204).send();
  } else {
    return response.status(401).json({ error: 'only the blog owner can delete the blog' });
  }
});

blogRouter.put('/:id', blogFinder, async (request, response) => {
  const { blog } = request as RequestWithBlogAndToken;
  if (!blog) return response.status(404).json({ error: 'blog not found' });
  blog.likes = request.body.likes || blog.likes + 1;
  await blog.save();
  response.json(blog);
});

// usando sql cru
blogRouter.get('/raw', async (_request, response) => {
  const blogs = await sequelize.query(
    `
    SELECT 
      b.id,
      b.author,
      b.title,
      b.url,
      b.likes,
      p.id AS publisher_id,
      p.username AS publisher_username,
      p.name AS publisher_name
    FROM blogs AS b
    LEFT OUTER JOIN users AS p
      ON b.publisher_id = p.id;
    `,
    {
      type: QueryTypes.SELECT,
    }
  );
  response.json(blogs);
});

blogRouter.get('/raw/:id', async (request, response) => {
  const [blog] = await sequelize.query('SELECT * FROM blogs WHERE id = $1', {
    type: QueryTypes.SELECT,
    bind: [request.params.id],
  });

  if (!blog) return response.status(404).json({ error: 'blog not found' });
  response.json(blog);
});

blogRouter.post('/raw', getAuth, async (request, response) => {
  const decodedToken = (request as RequestWithBlogAndToken).decodedToken;
  const blog: unknown = request.body;

  if (!isBlog(blog)) return response.status(400).json({ error: 'bad input' });
  if (!decodedToken) return response.status(401).json({ error: 'authentication not provided' });

  const [result] = await sequelize.query(
    'INSERT INTO blogs (author, url, title, likes, publisher_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    {
      type: QueryTypes.SELECT,
      bind: [
        request.body.author || null,
        request.body.url,
        request.body.title,
        request.body.likes || 0,
        decodedToken.id || null,
      ],
    }
  );
  response.status(201).json(result);
});

blogRouter.delete('/raw/:id', async (request, response) => {
  await sequelize.query('DELETE FROM blogs WHERE id = $1', {
    type: QueryTypes.DELETE,
    bind: [request.params.id],
  });

  response.status(204).send();
});

blogRouter.put('/raw/:id', async (request, response) => {
  const [updated] = await sequelize.query(
    'UPDATE blogs SET likes = $2 WHERE id = $1 RETURNING *',
    { type: QueryTypes.SELECT, bind: [request.params.id, request.body.likes] }
  );
  if (!updated) return response.status(404).json({ error: 'blog not found' });
  response.json(updated);
});

export default blogRouter;
