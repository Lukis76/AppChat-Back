import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createServer } from "http";
import express from "express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import bodyParser from "body-parser";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
// import { getSession } from "next-auth/react";
// import { resolvers } from "../src/graphql/resolvers";
// import { typeDefs } from "../src/graphql/typeDefs";
import * as dotenv from "dotenv";
import { GraphQLContext, SubscriptionContext } from "../src/utils/types";
import gql from "graphql-tag";

import { LoginUser, RegisterUser } from "./graphql/resolvers/user/mutation";
import { user } from "./graphql/resolvers/user/query";
///////////////////////////////////////////////////////////////////////////////////////
const typeDefs = gql`
  type User {
    id: String
    username: String
    email: String
    passwordHash: String
    token: String
  }

  input RegisterInput {
    username: String
    email: String
    password: String
    confirmPassword: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type Query {
    user(id: String!): User
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): User
    loginUser(loginInput: LoginInput): User
  }
`;

const resolvers = {
  Query: {
    user,
  },
  Mutation: {
    loginUser: LoginUser,
    registerUser: RegisterUser,
  },
};

///////////////////////////////////////////////////////////////////////////////////////

const main = async () => {
  // Create the schema, which will be used separately by ApolloServer and
  // the WebSocket server.
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // variales de entorno
  dotenv.config();

  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express();

  const httpServer = createServer(app);

  // Create our WebSocket server using the HTTP server we just set up.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql/subscriptions",
  });

  // Context parameters
  const prisma = new PrismaClient();
  const pubsub = new PubSub();

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
        // ctx is the graphql-ws Context where connectionParams live
        // if (ctx.connectionParams?.authToken) {
        //   const { authToken  } = ctx.connectionParams;
        console.log("context del index - authToken ===> ", ctx.connectionParams.authToken);
        //   return { authToken, prisma, pubsub };
        // } else {
        //   // Otherwise let our resolvers know we don't have a current user
        // }
        return { session: null, prisma, pubsub };
      },
    },
    wsServer
  );

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
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  const corsOptions = {
    origin: process.env.BASE_URL,
    credentials: true,
  };

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        // console.log("context del use con getsession - session ==>> ", req.headers);
        return { session: null, prisma, pubsub };
      },
    })
  );

  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(process.env.PORT, () => {
    console.log(`🚀 Server is now running on http://localhost:${process.env.PORT}/graphql 👍 💯 🇦🇷`);
  });
};
main();
