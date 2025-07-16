// Core Packages
require('dotenv').config()
const http = require('http')
const jwt = require('jsonwebtoken')
const express = require('express')
const cors = require('cors')

// Apollo Server & GraphQL
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')

// WebSocket Server & GraphQL Subscriptions
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

// MongoDB & Mongoose
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const User = require('./models/user')
const MONGODB_URI = process.env.MONGODB_URI_LOCAL
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log(`connected to database ${MONGODB_URI}`))
  .catch((err) => console.log('error connecting to mongodb: ', err.message))

// Main
const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
    introspection: true,
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req?.headers.authorization
        if (!auth || !auth.startsWith('Bearer ')) return
        const decodedToken = jwt.verify(
          auth.substring(7),
          process.env.JWT_SECRET
        )
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      },
    })
  )

  const PORT = 4000
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
