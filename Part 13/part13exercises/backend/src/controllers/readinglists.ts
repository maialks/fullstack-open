import express from 'express';
import ReadingList from '../models/ReadingList.js';
import { getAuth } from '../utils/middlewares.js';
import type { RequestWithToken } from '../types.js';

const readinglistsRouter = express.Router();

readinglistsRouter.get('/', async (_request, response) => {
  const readingList = await ReadingList.findAll({
    attributes: ['id', ['user_id', 'userId'], ['blog_id', 'blogId'], ['status_read', 'read']],
  });
  response.json(readingList);
});

readinglistsRouter.put('/:id', getAuth, async (request, response) => {
  if (!request.body.read || typeof request.body.read !== 'boolean')
    return response.status(400).json({ error: 'invalid request body' });
  const [_, [updatedEntry]] = await ReadingList.update(
    { status_read: request.body.read },
    {
      where: { id: request.params.id, user_id: (request as RequestWithToken).decodedToken?.id },
      returning: true,
    }
  );
  if (updatedEntry) {
    return response.json(updatedEntry);
  } else {
    return response.status(400).json({ error: 'reading list entry not found or unauthorized' });
  }
});

export default readinglistsRouter;
