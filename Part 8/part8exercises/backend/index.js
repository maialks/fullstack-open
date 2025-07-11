const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql')

const MONGODB_URI = process.env.MONGODB_URI_LOCAL
mongoose
  .connect(MONGODB_URI)
  .then(console.log(`connected to database ${MONGODB_URI}`))
  .catch((err) => console.log('error connecting to mongodb: ', err.message))

const typeDefs = `
  type Author {
    name: String!
    bookCount: Int! 
    born: Int
  } 

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
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
    allBooks(author: String, genres: [String]): [Book!]!
    allAuthors: [Author!]!
    bookCount: Int!
    authorCount: Int!
    me: User
    genres: [String!]!
  }

    type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    addAuthor(
      name: String!
      born: Int!
    ): Author
    editAuthor(
      name: String!
      born: Int!
    ): Author
    createUser(
      username: String!
      password: String!
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
    allBooks: async (root, args) => {
      if ((!args.author && !args.genres) || !args.genres.length)
        return Book.find({}).populate('author')
      if (args.genres.length && !args.author)
        return Book.find({ genres: { $in: args.genres } }).populate('author')

      const author = await Author.findOne({ name: args.author })
      if (!author)
        throw new GraphQLError('this author does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          },
        })

      if (args.author && !args.genres.length)
        return Book.find({ author: author._id }).populate('author')
      return Book.find({
        author: author._id,
        genres: { $in: args.genres },
      }).populate('author')
    },
    allAuthors: async () => {
      return await Author.find({})
    },
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    me: (root, args, context) => {
      return context.currentUser
    },
    genres: async () => {
      const aggregated = await Book.aggregate([
        { $unwind: '$genres' },
        { $group: { _id: '$genres' } },
        { $project: { genre: '$_id', _id: 0 } },
      ])
      return aggregated.map((obj) => obj.genre)
    },
  },
  Author: {
    bookCount: async (parent) => Book.countDocuments({ author: parent._id }),
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }

      const author = await Author.findOne({ name: args.author })
      if (!author)
        throw new GraphQLError('this author does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          },
        })

      try {
        const newBook = new Book({ ...args, author: author._id })
        await newBook.save()

        return await newBook.populate('author')
      } catch (error) {
        throw new GraphQLError('saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }
    },
    addAuthor: async (root, args) => {
      const author = new Author({ ...args })
      try {
        return await author.save()
      } catch (error) {
        throw new GraphQLError('author validation failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author)
        throw new GraphQLError('this author does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      try {
        author.born = args.born
        return await author.save()
      } catch (error) {
        throw new GraphQLError('failed to update author', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.born,
            error,
          },
        })
      }
    },
    createUser: async (root, { username, password, favoriteGenre }) => {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
      const user = new User({
        username,
        passwordHash,
        favoriteGenre,
      })
      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError('creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: username,
            error,
          },
        })
      }
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username: username })
      const passwordCorrect =
        user !== null
          ? await bcrypt.compare(password, user.passwordHash)
          : false

      if (!(user && passwordCorrect)) {
        throw new GraphQLError('authentication error', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      const token = jwt.sign(userForToken, process.env.JWT_SECRET)
      return { value: token }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req?.headers.authorization
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`server running at ${url}`)
})
