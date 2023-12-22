const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

jest.setTimeout(20000)

beforeEach(async () => {
  await Blog.deleteMany({})
  for (const { title, author, url, likes, userId } of helper.blogListInitial) {
    const user = await User.findById(userId)
    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user._id
    })
    const newBlog = await blog.save()
    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()
  }
})

describe('when there is initially some blogs saved', () => {
  test('all blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogListDb()
    expect(blogs).toHaveLength(helper.blogListInitial.length)
  })

  test('every blog has an id as property', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const ids = response.body.map((blog) => blog.id)
    expect(ids).toHaveLength(helper.blogListInitial.length)
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

    const token = helper.expirableToken({
      username: 'hellas',
      id: '6580fd764f055d00a91c94bc'
    })

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({
        Authorization: `Bearer ${token}`
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogListDb()
    expect(blogsAtEnd).toHaveLength(helper.blogListInitial.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).toContain(newBlog.title)
  })

  test('fails with proper status code if token invalid', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 17
    }

    const invalidToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1ODI0YjliZTJhODIyNmYxMjY3YWYzZSIsImlhdCI6MTcwMzAzNzkwMSwiZXhwIjoxNzAzMDQxNTAxfQ.NgG08goGNV0gEz_GlV9psuwZPWbFv4Lv4CnRKLPUF_k'

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({
        Authorization: `Bearer ${invalidToken}`
      })
      .expect(401)

    const blogsAtEnd = await helper.blogListDb()
    expect(blogsAtEnd).toHaveLength(helper.blogListInitial.length)

    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).not.toContain(newBlog.title)
  })

  test('you can add a blog regardless likes property is defined', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    const token = helper.expirableToken({
      username: 'hellas',
      id: '6580fd764f055d00a91c94bc'
    })

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({
        Authorization: `Bearer ${token}`
      })
      .expect(201)
    expect(response.body.likes).toBeDefined()
  })

  test('fails with status code 400 if title or url property are missing', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin'
    }

    const token = helper.expirableToken({
      username: 'hellas',
      id: '6580fd764f055d00a91c94bc'
    })

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({
        Authorization: `Bearer ${token}`
      })
      .expect(400)

    const blogsAtEnd = await helper.blogListDb()
    expect(blogsAtEnd).toHaveLength(helper.blogListInitial.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id and token are valid', async () => {
    const blogsAtStart = await helper.blogListDb(),
      blogToDelete = blogsAtStart[0]

    const token = helper.expirableToken({
      username: 'hellas',
      id: '6580fd764f055d00a91c94bc'
    })

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .expect(204)

    const blogsAtEnd = await helper.blogListDb()
    expect(blogsAtEnd).toHaveLength(helper.blogListInitial.length - 1)
  })
})

describe('update a blog', () => {
  test('increase by one the number of likes in a blog', async () => {
    const blogsAtStart = await helper.blogListDb(),
      blogToUpdate = blogsAtStart[0]

    const likesIncrementedByOne = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(likesIncrementedByOne)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogListDb()
    expect(blogsAtEnd).toHaveLength(helper.blogListInitial.length)
    expect(response.body.likes).toBe(blogToUpdate.likes + 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
