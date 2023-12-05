require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express(),
  PORT = process.env.PORT || 3001

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  }
]

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

app.get('/info', (req, res) => {
  const total = persons.length,
    date = new Date()

  res.send(`
    <p>Phonebook has info for ${total} people</p>
    <p>${date}</p>
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id),
    person = persons.find((person) => person.id === id)

  if (!person) {
    res.status(404).json({ error: 'not found' })
    return
  }

  res.json(person)
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

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  next(err)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})
