const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogRouter.post('/', (request, response, next) => {
  const body = request.body
  body.likes = body.likes ?? 0

  const blog = new Blog(body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = blogRouter
