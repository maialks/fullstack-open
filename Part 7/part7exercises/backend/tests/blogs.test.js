const { test, describe } = require('node:test');
const assert = require('node:assert');
const {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
} = require('../utils/list_helper');

const {
  emptyBlogsList,
  singleBlogList,
  multipleBlogsList,
} = require('./test_helper');

describe('total likes', () => {
  test('when list is empty', () => {
    const res = totalLikes(emptyBlogsList);
    assert.strictEqual(res, 0);
  });

  test('when list has a single blog', () => {
    const res = totalLikes(singleBlogList);
    assert.strictEqual(res, 5);
  });

  test('when list has mutiple blogs', () => {
    const res = totalLikes(multipleBlogsList);
    assert.strictEqual(res, 36);
  });
});

describe('favorite blog', () => {
  test('when list is empty', () => {
    const res = favoriteBlog(emptyBlogsList);
    assert.strictEqual(res, null);
  });

  test('when list has a single blog', () => {
    const res = favoriteBlog(singleBlogList);
    assert.deepStrictEqual(res, {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('when list has mutiple blogs', () => {
    const res = favoriteBlog(multipleBlogsList);
    assert.deepStrictEqual(res, {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });
});
describe('most blogs', () => {
  test('when list is empty', () => {
    const res = mostBlogs(emptyBlogsList);
    assert.strictEqual(res, null);
  });

  test('when list has a single blog', () => {
    const res = mostBlogs(singleBlogList);
    assert.deepStrictEqual(res, {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    });
  });

  test('when list has mutiple blogs', () => {
    const res = mostBlogs(multipleBlogsList);
    assert.deepStrictEqual(res, {
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});
describe('most likes', () => {
  test('when list is empty', () => {
    const res = mostLikes(emptyBlogsList);
    assert.strictEqual(res, null);
  });

  test('when list has a single blog', () => {
    const res = mostLikes(singleBlogList);
    assert.deepStrictEqual(res, {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('when list has mutiple blogs', () => {
    const res = mostLikes(multipleBlogsList);
    assert.deepStrictEqual(res, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});
