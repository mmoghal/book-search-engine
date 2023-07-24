const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Your authentication logic goes here
    // Example: Check the authorization header for user token and validate the user
    // You may use libraries like jsonwebtoken to handle token validation
    const token = req.headers.authorization || '';
    // ... validate the token and get the user data
    const user = { _id: 'user_id', username: 'example_user' };
    return { user };
  },
});

// Start the Apollo Server before applying middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startServer();

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`));
});
