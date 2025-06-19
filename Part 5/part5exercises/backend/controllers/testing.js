const router = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

router.post('/reset', async (req, res) => {
  console.log('reset')
  await User.deleteMany({})
  await Blog.deleteMany({})

  res.status(204).end()
})

module.exports = router
