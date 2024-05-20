import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import createUploadLink  from 'apollo-upload-client/createUploadLink.mjs';
import { ApolloLink } from '@apollo/client/link/core';
import { setContext } from '@apollo/client/link/context';

const uploadLink = createUploadLink({
  uri: 'https://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
});

const link = ApolloLink.from([authLink, uploadLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
