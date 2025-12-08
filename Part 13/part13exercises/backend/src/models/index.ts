import Blog from './Blog.js';
import User from './User.js';
import Session from './Session.js';
import ReadingList from './ReadingList.js';

User.hasMany(Session, { foreignKey: 'user_id', as: 'userSessions' });
Session.belongsTo(User, { foreignKey: 'user_id', as: 'sessionUser' });

User.hasMany(Blog, { foreignKey: 'publisher_id', as: 'publishedBlogs' });
Blog.belongsTo(User, { foreignKey: 'publisher_id', as: 'publisher' });

User.belongsToMany(Blog, {
  through: ReadingList,
  foreignKey: 'user_id',
  otherKey: 'blog_id',
  as: 'readings',
});
Blog.belongsToMany(User, {
  through: ReadingList,
  foreignKey: 'blog_id',
  otherKey: 'user_id',
  as: 'readers',
});

export { Blog, User, ReadingList };
