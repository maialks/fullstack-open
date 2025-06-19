const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    match: /^[a-zA-Z0-9_-]{3,10}$/,
    unique: true,
    // valida strings com 3 a 10 caracteres contendo apenas letras, números, _ e -
  },
  name: {
    type: String,
    required: true,
    // match: /^(?!.* {2,})[a-zA-Z ]{2,}$/,
    // o nome deve ter pelo menos 2 caracteres e conter apenas letras e espaços.
    // (? !.* {2,}) é uma negative lookahead que garante que não haja,
    // em nenhum lugar da string, dois ou mais espaços consecutivos
  },
  passwordHash: String,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'blog' }],
});

userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
    delete returnedObj.passwordHash;
  },
});

module.exports = mongoose.model('user', userSchema, 'users');
