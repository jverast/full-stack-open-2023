const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogListInitial)
})

describe('when there is initially some blogs saved', () => {
  test('all blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.blogListInitial.length)
  })
})

describe('viewing a specific blog', () => {
  test('id is defined', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body[0].id).toBeDefined()
  })
})

describe('additon of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
    }
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogListDb()
    expect(blogsAtEnd).toHaveLength(helper.blogListInitial.length + 1)

    const newBlogWithId = { ...newBlog, id: response.body.id }
    expect(response.body).toEqual(newBlogWithId)
  })

  test('likes property is missing', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    const response = await api.post('/api/blogs').send(newBlog).expect(201)
    expect(response.body.likes).toBeDefined()
  })

  test('title or url properties are missing', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin'
    }

    const response = await api.post('/api/blogs').send(newBlog).expect(400)
    expect(response.body.title).toBeDefined()
    expect(response.body.url).toBeDefined()
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogListDb(),
      blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogListDb()
    expect(blogsAtEnd).toHaveLength(helper.blogListInitial.length - 1)
  })
})

describe('update a blog', () => {
  test('succeed in updating the number of likes on a blog', async () => {
    const blogsAtStart = await helper.blogListDb(),
      blogToUpdate = blogsAtStart[0]

    const likesToUpdate = { likes: 13 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(likesToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogListDb()
    expect(blogsAtEnd).toHaveLength(helper.blogListInitial.length)
    expect(response.body.likes).toBe(likesToUpdate.likes)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
