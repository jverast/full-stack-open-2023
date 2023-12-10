const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (const blog of helper.blogListInitial) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

const api = supertest(app)

test('all notes are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body).toHaveLength(helper.blogListInitial.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})
