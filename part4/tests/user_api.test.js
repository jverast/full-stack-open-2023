const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

jest.setTimeout(20000)

beforeEach(async () => {
  await User.deleteMany({})

  for (const { username, name, password } of helper.usersInitial) {
    const userObject = new User({
      username,
      name,
      passwordHash: await bcrypt.hash(password, 10)
    })
    await userObject.save()
  }
})

describe('creating a new user', () => {
  test('a valid user can be added', async () => {
    const newUser = {
      username: 'casper',
      name: 'Paulo Casperini',
      password: 'abcde'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersDb()
    expect(usersAtEnd).toHaveLength(helper.usersInitial.length + 1)

    const usernames = usersAtEnd.map((user) => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('fails with status code 400 if data invalid', async () => {
    const newUser = {
      username: 'hellas',
      name: 'Paulo Casperini',
      password: 'sekret'
    }

    await api.post('/api/users').send(newUser).expect(400)

    const usersAtEnd = await helper.usersDb()
    expect(usersAtEnd).toHaveLength(helper.usersInitial.length)
  })
})

describe('when there is initially some users saved', () => {
  test('all users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
