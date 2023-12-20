const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const blogListInitial = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    userId: '6580fd764f055d00a91c94bc'
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    userId: '6580fd764f055d00a91c94bc'
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 21,
    userId: '6580fd764f055d00a91c94c0'
  }
]

const usersInitial = [
  {
    username: 'hellas',
    name: 'Arto Hellas',
    password: '12345'
  },
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'qwerty'
  }
]

const nonExistingId = async () => {
  const tempBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }

  const blog = new Blog(tempBlog)
  await blog.save()
  await blog.deleteOne()

  return blog._id.toJSON()
}

const blogListDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const expirableToken = (userForToken) => {
  return jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 })
}

module.exports = {
  blogListInitial,
  nonExistingId,
  blogListDb,
  usersInitial,
  usersDb,
  expirableToken
}
