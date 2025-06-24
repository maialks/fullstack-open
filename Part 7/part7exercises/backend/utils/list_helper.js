const _ = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogsList) => {
  if (blogsList.length === 0) return 0;
  return blogsList.reduce(
    (acc, cur) => (!isNaN(cur.likes) ? acc + cur.likes : acc),
    0
  );
};

const favoriteBlog = (blogsList) => {
  if (blogsList.length === 0) return null;
  const res = blogsList.sort((a, b) => b.likes - a.likes)[0];
  return {
    title: res.title,
    author: res.author,
    likes: res.likes,
  };
};

const mostBlogs = (blogsList) => {
  if (blogsList.length === 0) return null;

  const authorsCount = _.toPairs(_.countBy(blogsList, 'author'));

  const authorsArr = _.map(authorsCount, ([author, blogs]) => ({
    author,
    blogs,
  }));

  return _.maxBy(authorsArr, 'blogs');
};

const mostLikes = (blogsList) => {
  if (blogsList.length === 0) return null;

  const groupedByAuthor = _.groupBy(blogsList, 'author');

  const authorsWithLikes = _.map(groupedByAuthor, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes'),
  }));

  return _.maxBy(authorsWithLikes, 'likes');
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
