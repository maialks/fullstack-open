const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

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
      const authors = await Author.find({})
      const bookCountsByAuthor = await Book.aggregate([
        { $group: { _id: '$author', total: { $sum: 1 } } },
      ])

      // Melhoria: Usa Map para busca O(1) em vez de find O(n)
      const bookCountMap = new Map(
        bookCountsByAuthor.map((entry) => [entry._id.toString(), entry.total])
      )
      return authors.map((author) => ({
        // Melhoria: Usa toObject para objeto puro, mais seguro que _doc
        ...author.toObject(),
        // Busca O(1) usando Map
        bookCount: bookCountMap.get(author._id.toString()) || 0,
      }))
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

        const populatedBook = await newBook.populate('author')
        pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })
        return populatedBook
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
