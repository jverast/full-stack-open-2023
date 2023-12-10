const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body
  body.likes = body.likes ?? 0

  const blog = new Blog(body)

  try {
    const newBlog = await blog.save()
    response.status(201).json(newBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter
