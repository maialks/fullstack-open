const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const {
  requestLogger,
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require('./utils/middleware');
const logger = require('./utils/logger');
const { MONGODB_URI } = require('./utils/config');
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
})();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api/blogs', tokenExtractor, userExtractor, blogRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use(errorHandler);

module.exports = app;
