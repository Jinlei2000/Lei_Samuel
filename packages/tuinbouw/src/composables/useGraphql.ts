import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client/core'

export default () => {
  const httpLink = createHttpLink({
    uri: 'http://[::1]:8008/graphql',
  })

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  })

  return {
    apolloClient,
  }
}
