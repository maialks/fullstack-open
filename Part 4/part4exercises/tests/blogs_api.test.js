const { test, beforeEach, after, describe } = require('node:test');
const Blog = require('../models/blog');
const User = require('../models/user');
const { multipleBlogsList, usersList, newBlog } = require('./test_helper');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

describe('authentication tests', () => {
  const tokens = {
    invalid:
      'INVALID-OiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY3ZTgzMzQ5OTI5OTI3YzNlMmZjZThmNiIsImlhdCI6MTc0MzI3NjMyMX0._G3ez-c0OVmqC6wib7O_Ht1FQrk78F9LuWvsh8mhRGo',
  };
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    await Promise.all(
      usersList.map(async (user) => {
        await api.post('/api/users').send(user);
      })
    );

    const resRoot = await api
      .post('/api/login')
      .send({ username: 'root', password: 'chama' });
    tokens.root = resRoot._body.token;

    const resLks = await api
      .post('/api/login')
      .send({ username: 'lks', password: 'safepass' });
    tokens.lks = resLks._body.token;
  });

  test('user fails create blog without authentication', async () => {
    const res = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(403)
      .expect((res) => res.text.error === 'not authenticated');
  });

  test('user succeds creating a blog with valid token', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${tokens.root}` })
      .expect(201);
  });

  test('user fails creating a blog with invalid token', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${tokens.invalid}` })
      .expect(401)
      .expect((res) => res.text.error === 'invalid or malformated token');
  });

  test('user succeds deleting a blog with valid token', async () => {
    let blogId;
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${tokens.root}` })
      .expect((res) => (blogId = res._body.id));

    await api
      .delete(`/api/blogs/${blogId}`)
      .set({ Authorization: `Bearer ${tokens.root}` })
      .expect(204);
  });

  test('user fails deleting a blog with invalid token', async () => {
    let blogId;
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${tokens.root}` })
      .expect((res) => (blogId = res._body.id));

    await api
      .delete(`/api/blogs/${blogId}`)
      .set({ Authorization: `Bearer ${tokens.invalid}` })
      .expect(401)
      .expect((res) => res.text.error === 'invalid or malformated token');
  });

  test('user fails deleting blog created by other user', async () => {
    let blogId;
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${tokens.root}` })
      .expect((res) => (blogId = res._body.id));

    await api
      .delete(`/api/blogs/${blogId}`)
      .set({ Authorization: `Bearer ${tokens.lks}` })
      .expect(403)
      .expect(
        (res) => res.text.error === 'you have no permission to delete this blog'
      );
  });
});

describe('fetching blogs', () => {
  beforeEach(async () => await Blog.deleteMany({}));
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    await Promise.all(
      multipleBlogsList.map(async (blog) => {
        const newBlog = new Blog(blog);
        await newBlog.save();
      })
    );

    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        if (response.body.length !== multipleBlogsList.length) {
          throw new Error(
            `Expected ${multipleBlogsList.length} blogs, but got ${response.body.length}`
          );
        }
      });
  });
});

describe('missing properties', () => {
  let token;
  beforeEach(async () => {
    await User.deleteMany({});
    await api.post('/api/users').send(usersList[0]);

    await api
      .post('/api/login')
      .send({ username: 'root', password: 'chama' })
      .expect((res) => (token = res._body.token));
  });
  test('likes property is missing', async () => {
    const newBlog = {
      title: 'Pulp Fiction is Live on Sessão da Tarde',
      author: 'Lucas M. Soares',
      url: 'https://chama.ufc.br/pulp/fiction',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        response.body._message === 'Blog validation failed';
      });
  });

  test('title property is missing', async () => {
    const newBlog = {
      author: 'Lucas M. Soares',
      url: 'https://chama.ufc.br/pulp/fiction',
      likes: 30,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        response.body._message === 'Blog validation failed';
      });
  });

  test('url property is missing', async () => {
    const newBlog = {
      title: 'Pulp Fiction is Live on Sessão da Tarde',
      author: 'Lucas M. Soares',
      likes: 30,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        response.body._message === 'Blog validation failed';
      });
  });
});

after(async () => {
  await mongoose.connection.close();
});
