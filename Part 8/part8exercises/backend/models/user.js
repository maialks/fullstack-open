const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    require: true,
  },
  passwordHash: {
    type: String,
    require: true,
  },
  favoriteGenre: {
    type: String,
    requrie: true,
  },
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)
