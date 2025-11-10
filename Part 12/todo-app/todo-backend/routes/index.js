const express = require('express');
const router = express.Router();
const redis = require('../redis');

const configs = require('../util/config');

let visits = 0;

/* GET index data. */
router.get('/', async (req, res) => {
  visits++;

  res.send({
    ...configs,
    visits,
  });
});

router.get('/statistics', async (_req, res) => {
  const counter = await redis.getAsync('added_todos');
  res.send(JSON.stringify({ added_todos: counter || 0 }));
});

module.exports = router;
