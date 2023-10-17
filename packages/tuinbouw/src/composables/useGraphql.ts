import {
  from,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import useFirebase from './useFirebase'
import { onError } from '@apollo/client/link/error'
import { logErrorMessages } from '@vue/apollo-util'

const { firebaseUser } = useFirebase()

export default () => {
  const httpLink = createHttpLink({
    uri: 'http://[::1]:3000/graphql',
    credentials: 'same-origin',
  })

  const authLink = setContext(async (_, { headers }) => ({
    headers: {
      ...headers,
      // authorization: `Bearer ${await firebaseUser.value?.getIdToken()}`,
      authorization: firebaseUser.value
        ? `Bearer ${await firebaseUser.value.getIdToken()}`
        : '',
    },
  }))

  // OLD

  // const apolloClient = new ApolloClient({
  //   link: authLink.concat(httpLink),
  //   cache: new InMemoryCache(),
  // })

  const errorLink = onError(error => {
    if (import.meta.env.DEV) logErrorMessages(error)
  })

  const apolloClient = new ApolloClient({
    link: from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
  })

  return {
    apolloClient,
  }
}
