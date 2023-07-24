// App.js

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar'; // Update the path to the Navbar component
import LoginForm from './components/LoginForm'; // Update the path to the LoginForm component
import SignupForm from './components/SignupForm'; // Update the path to the SignupForm component

const client = new ApolloClient({
  uri: '/graphql', // Replace this with your server URL
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path="/" component={Navbar} />
          <Route path="/login" component={LoginForm} />
          <Route path="/signup" component={SignupForm} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
