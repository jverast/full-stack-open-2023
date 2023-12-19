const morgan = require('morgan')

morgan.token('body', (request, response) => {
  return JSON.stringify(request.body) !== '{}' && JSON.stringify(request.body)
})

const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
)

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }

  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  logger,
  unknownEndpoint,
  errorHandler
}
