import useFirebase from './useFirebase'
import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  split,
} from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { logErrorMessages } from '@vue/apollo-util'
import { createClient } from 'graphql-ws'

const { firebaseUser } = useFirebase()

export default () => {
  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_BACKEND_URL,
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

  const errorLink = onError(error => {
    if (import.meta.env.DEV) logErrorMessages(error)
  })

  const wsLink = new GraphQLWsLink(
    createClient({
      url: 'ws://localhost:3001/graphql',
    }),
  )

  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    from([authLink, errorLink, httpLink]),
  )

  // OLD

  // const apolloClient = new ApolloClient({
  //   link: authLink.concat(httpLink),
  //   cache: new InMemoryCache(),
  // })

  const apolloClient = new ApolloClient({
    link,
    // link: from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
  })

  return {
    apolloClient,
  }
}
