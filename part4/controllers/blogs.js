const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const { url, title, author, likes } = request.body

  try {
    const user = request.user
    const blog = new Blog({
      url,
      title,
      author,
      user: user._id,
      likes: likes ?? 0
    })

    const newBlog = await blog.save()
    response.status(201).json(newBlog)

    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id),
      userid = user._id

    if (blog.user.toString() !== userid.toString()) {
      return response.status(401).json({ error: 'user not match' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true, context: 'query' }
    )
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter
