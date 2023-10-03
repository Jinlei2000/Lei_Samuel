import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import useFirebase from './useFirebase'

const { firebaseUser } = useFirebase()

export default () => {
  const httpLink = createHttpLink({
    uri: 'http://[::1]:3000/graphql',
    credentials: 'same-origin',
  })

  const authLink = setContext(async (_, { headers }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${await firebaseUser.value?.getIdToken()}`,
    },
  }))

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })

  return {
    apolloClient,
  }
}
