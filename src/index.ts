import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { createServer } from 'http'
import express from 'express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import bodyParser from 'body-parser'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'
import { GraphQLContext, SubscriptionContext } from './utils/types'
import { getSession } from 'next-auth/react'
import { resolvers } from './graphql/resolvers'
import { typeDefs } from './graphql/typeDefs'
import dotenv from 'dotenv'
import { Session } from '@utils/types'

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers })

// variales de entorno
dotenv.config()

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express()

const httpServer = createServer(app)

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql/subscriptions',
})

// Context parameters
const prisma = new PrismaClient()
const pubsub = new PubSub()

const serverCleanup = useServer(
  {
    schema,
    context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
      // ctx is the graphql-ws Context where connectionParams live
      if (ctx?.connectionParams?.session) {
        const { session } = ctx.connectionParams
        return { session, prisma, pubsub }
      } else {
        // Otherwise let our resolvers know we don't have a current user
        return { session: null, prisma, pubsub }
      }
    },
  },
  wsServer
)

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  // csrfPrevention: true,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server.
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
})

await server.start()

const corsOptions = {
  origin: process.env.BASE_URL,
  credentials: true,
}

app.use(
  '/graphql',
  cors<cors.CorsRequest>(corsOptions),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }): Promise<GraphQLContext> => {
      const session = (await getSession({ req })) as Session
      return { session, prisma, pubsub }
    },
  })
)

const PORT = 4000
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server is now running on http://localhost:${PORT}/graphql 👍 💯 🇦🇷`
  )
})
