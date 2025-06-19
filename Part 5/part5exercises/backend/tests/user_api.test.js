const { test, beforeEach, after, describe } = require('node:test');
const assert = require('node:assert');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { usersInDb } = require('./test_helper');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('chama', 10);
    const user = new User({ name: 'eduardo', username: 'dudu', passwordHash });

    await user.save();
  });
  test('creation succeeds with a fresh username', async () => {
    const newUser = {
      username: 'vic',
      name: 'victoria',
      password: '123pass',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('creation fails with a duplicated username', async () => {
    const user = {
      username: 'vic',
      name: 'victor',
      password: 'oss123',
    };

    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const duplicatedUser = {
      username: 'lks',
      name: 'Lukarius',
      password: 'oss123',
    };

    await api
      .post('/api/users')
      .send(duplicatedUser)
      .expect(400)
      .expect(
        (response) => response._body.error === 'expected username to be unique'
      );
  });
});

after(async () => {
  await mongoose.connection.close();
});
