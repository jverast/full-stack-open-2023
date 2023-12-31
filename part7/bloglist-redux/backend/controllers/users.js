const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { user: 0, likes: 0 })
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!password) {
    return response.status(400).json({ error: 'password is required' })
  }

  if (typeof password !== 'string') {
    return response.status(400).json({ error: 'password must be a string' })
  }

  if (password.length < 4) {
    return response
      .status(400)
      .json({ error: 'password length must be greater or equal to 3' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  try {
    const newUser = await user.save()
    response.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
