const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: { type: String, required: true },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    validator: Number.isInteger,
    default: 0,
  },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

blogSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model('blog', blogSchema, 'blogs');
