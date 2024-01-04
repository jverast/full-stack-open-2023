const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB: ', error.message)
  })

const typeDefs = `
  type Author {
    name: String!
    bookCount: Int
    born: Int
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
    
  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

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
    allAuthors: async () => {
      const authors = await Author.find({})

      for (const author of authors) {
        const booksByAuthor = await Book.find({ author: author._id })
        author.bookCount = booksByAuthor.length
      }

      return authors
    },
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

      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({ ...args, author: author._id })
      await book.populate('author')

      await book.save()
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
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
