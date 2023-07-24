const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: (_, __, context) => {
      return context.user;
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError('Invalid credentials');
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
          throw new AuthenticationError('Invalid credentials');
        }

        const token = signToken(user); // Implement this function to generate a JWT token
        return { token, user };
      } catch (err) {
        throw new Error('Something went wrong while logging in');
      }
    },
    addUser: async (_, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user); // Implement this function to generate a JWT token
        return { token, user };
      } catch (err) {
        throw new Error('Something went wrong while registering user');
      }
    },
    saveBook: async (_, { bookData }, context) => {
      try {
        // Ensure user is logged in
        if (!context.user) {
          throw new AuthenticationError('You need to be logged in to perform this action');
        }

        // Add the book to the user's savedBooks array
        const user = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        );

        return user;
      } catch (err) {
        throw new Error('Something went wrong while saving the book');
      }
    },
    removeBook: async (_, { bookId }, context) => {
      try {
        // Ensure user is logged in
        if (!context.user) {
          throw new AuthenticationError('You need to be logged in to perform this action');
        }

        // Remove the book from the user's savedBooks array
        const user = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return user;
      } catch (err) {
        throw new Error('Something went wrong while removing the book');
      }
    },
  },
};

module.exports = resolvers;
