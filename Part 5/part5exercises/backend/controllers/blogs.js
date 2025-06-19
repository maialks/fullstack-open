require('dotenv').config()
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({}).populate('publisher')
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id).populate(publisher)
  response.json(blog)
})

blogRouter.post('/', async (request, response, next) => {
  const user = await User.findById(request.user?.id)
  if (!user) throw new Error('not authenticated')

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    publisher: user.id,
  })

  const res = await (await blog.save()).populate('publisher')

  user.blogs = user.blogs.concat(res._id)
  await user.save()

  response.status(201).json(res)
})

blogRouter.delete('/:id', async (request, response, next) => {
  console.log(request.user)
  const toBeDeleted = await Blog.findById(request.params.id)
  if (toBeDeleted.publisher.toString() !== request.user.id)
    throw new Error('permission denied')
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const updatedBlog = {
    user: body.user,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }
  await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
    runValidators: true,
  })
  response.json(updatedBlog)
})

module.exports = blogRouter
