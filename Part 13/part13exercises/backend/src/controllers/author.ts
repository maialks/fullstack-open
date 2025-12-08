import express from 'express';
import { Blog } from '../models/index.js';
import { sequelize } from '../utils/database.js';
import { QueryTypes } from 'sequelize';
const authorRouter = express.Router();

authorRouter.get('/', async (_request, response) => {
  const result = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
  });
  response.json(result);
});

authorRouter.get('/raw', async (_request, response) => {
  const result = await sequelize.query(
    `
      SELECT 
        author, 
        COUNT(*) as articles,
        SUM(likes) as likes 
      FROM blogs
      GROUP BY author
    `,
    { type: QueryTypes.SELECT }
  );
  response.json(result);
});

export default authorRouter;
