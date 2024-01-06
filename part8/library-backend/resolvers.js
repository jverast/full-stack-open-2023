const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const User = require('./models/user')
const Author = require('./models/author')

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate('author')
      }

      const authors = await Book.find({}).populate('author')

      if (args.author && args.genre) {
        return authors.filter(
          ({ author, genres }) =>
            author.name === args.author && genres.includes(args.genre)
        )
      } else if (args.author) {
        return authors.filter(({ author }) => author.name === args.author)
      } else {
        return authors.filter(({ genres }) => genres.includes(args.genre))
      }
    },
    allAuthors: async () => Author.find({}),
    me: async (root, args, { currentUser }) => {
      return currentUser
        ? User.findOne({ username: currentUser.username })
        : null
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      for (const key in args) {
        if (!/title|author/.test(key)) {
          continue
        }

        if (args[key].length < 4) {
          throw new GraphQLError(
            `'${key}' must be at least 4, got ${args[key].length}`,
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args[key]
              }
            }
          )
        }
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) author = new Author({ name: args.author })
      else author.bookCount = author.bookCount + 1

      await author.save()

      const book = new Book({ ...args, author: author._id })
      await book.populate('author')

      await book.save()

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      if (args.name.length < 4) {
        throw new GraphQLError(
          `'name' must be at least 4, got ${args.name.length}`,
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name
            }
          }
        )
      }

      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('user creation failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }

      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'sekret') {
        throw new GraphQLError(`wrong credentials`, {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = { username: args.username, id: user._id }

      return {
        value: jwt.sign(userForToken, process.env.JWT_SECRET, {
          expiresIn: '24h'
        })
      }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers
