import { ApolloServer, } from '@apollo/server';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './config/connection.js';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

dotenv.config();

import { gql } from 'graphql-tag';
import resolvers from './schema/resolvers/resolvers.js';
import AuthService, { MyContext, TRequest } from './utils/auth.js';
import Redis from './config/redis.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typeDefs = gql(
  readFileSync(resolve(__dirname, '../src/schema/monolith.graphql'), {
    encoding: 'utf-8',
  })
);

const PORT = process.env.PORT || 4000;


async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express();

  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql',
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
      context: async (ctx: TRequest) => {
        return AuthService.serverCleanup(ctx);
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
    csrfPrevention: false,
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginInlineTraceDisabled(),
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

  app.set('trust proxy', 1);
  //Helmet helps secure Express apps by setting HTTP response headers.
  app.use(helmet());
  //protect against HTTP Parameter Pollution attacks
  app.use(hpp())

  app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 1000, // Limit each IP to 2 requests per `window` (here, per 10 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: 'Too many requests from this IP, please try again later.',
  }))

  app.use(graphqlUploadExpress());

  // Ensure we wait for our server to start
  await server.start();

  app.get('/', (_req, res) => {
    process.env.NODE_ENV === 'production';
    res.send(
      `
        <h1>Server is up and running!</h1>
        <h2>Check out the GraphQL endpoint at 
          <a href='graphql'>
            /graphql
          </a>
        </h2>
        `
    );
  });

  app.use(bodyParser.json());

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: '*',
    }),
    bodyParser.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => {
        return await AuthService.authMiddleware(req as MyContext)
      }
    }),
  );

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

async function shutdown() {
  try {
    // Close the Redis connection
    Redis.publisher.disconnect();
    Redis.subscriber.disconnect();
    console.log('Redis connection closed.');
  } catch (error) {
    console.error('Error closing Redis connection:', error);
  }
  process.exit(0);
}

db.once('open', () => {
  startApolloServer().catch((error) => {
    console.error('Failed to start Apollo Server:', error);
    process.exit(1);
  });
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('SIGINT', async () => {
  console.log('Server is shutting down...');
  await shutdown();
});