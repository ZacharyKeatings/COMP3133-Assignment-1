const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./schemas/typeDefs");
const userResolvers = require("./resolvers/userResolvers");
const employeeResolvers = require("./resolvers/employeeResolvers");
require("dotenv").config();

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers: [userResolvers, employeeResolvers],
  context: ({ req }) => ({ req }),
});

server.start().then(() => {
  server.applyMiddleware({ app });

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("MongoDB Connected...");
    app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}${server.graphqlPath}`));
  });
});
