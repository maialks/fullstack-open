const { test } = require('node:test');
const assert = require('node:assert');
const { dummy } = require('../utils/list_helper');

test('dummy returns 1', () => {
  const blogs = [];

  const res = dummy(blogs);
  assert.strictEqual(res, 1);
});
