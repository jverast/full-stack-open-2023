require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express(),
  PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('content', (req, res) => {
  return Object.values(req.body).length && JSON.stringify(req.body)
})
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :content'
  )
)

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((err) => next(err))
})

app.get('/info', (req, res, next) => {
  Person.find({})
    .countDocuments()
    .then((total) => {
      res.send(`
        <p>Phonebook has info for ${total} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch((err) => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      person ? res.json(person) : res.status(404).json({ error: 'not found' })
    })
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!number) {
    return res.status(400).json({ error: 'number missing' })
  }

  if (!name) {
    return res.status(400).json({ error: 'name missing' })
  }

  const person = new Person({
    name,
    number
  })

  person
    .save()
    .then((person) => {
      res.status(201).json(person)
    })
    .then((err) => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  Person.findByIdAndUpdate(req.params.id, body, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((err) => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  next(err)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})
