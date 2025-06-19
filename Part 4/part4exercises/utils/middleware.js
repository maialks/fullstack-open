const morgan = require('morgan');
const logger = require('./logger');
const { request } = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

morgan.token('body', (req) => JSON.stringify(req.body));

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
);

const errorHandler = (error, request, response, next) => {
  // logger.error(error);
  console.log(`Middleware: ${error.message}`);
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.message === 'not authenticated')
    return response.status(403).json({ error: 'not authenticated' });
  if (error.message.includes('E11000 duplicate key error collection')) {
    return response
      .status(400)
      .json({ error: 'expected username to be unique' });
  }
  if (
    error.message.includes('invalid signature') ||
    error.message === 'jwt malformed' ||
    error.message === 'invalid token'
  ) {
    return response.status(401).json({ error: 'invalid or malformated token' });
  }
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'invalid or malformated id' });
  }
  if (error.message == 'permission denied') {
    return response
      .status(403)
      .json({ error: 'you have no permission to delete this blog' });
  }
  next(error);
};

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get('authorization');

  if (!authorization) return next();

  if (authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
    next();
  }
};

const userExtractor = async (request, response, next) => {
  if (!request.token) return next();

  const decodedToken = await jwt.verify(request.token, process.env.SECRET);
  request.user = { username: decodedToken.username, id: decodedToken.id };
  return next();
};

module.exports = {
  requestLogger,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
