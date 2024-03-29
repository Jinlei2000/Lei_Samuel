import useFirebase from './useFirebase'
import useGraphql from './useGraphql'
import { GET_USER_BY_UID } from '@/graphql/user.query'
import { type CustomUser, Role } from '@/interfaces/custom.user.interface'
import { provideApolloClient, useQuery } from '@vue/apollo-composable'
import LogRocket from 'logrocket'
import { ref } from 'vue'

const customUser = ref<CustomUser | null>()

const { firebaseUser } = useFirebase()
const { apolloClient } = useGraphql()

provideApolloClient(apolloClient)

const restoreCustomUser = async () => {
  return new Promise<void>(resolve => {
    const { onResult } = useQuery(GET_USER_BY_UID, {
      uid: firebaseUser.value?.uid,
    })
    onResult(result => {
      if (result.data) {
        // console.log(result)
        customUser.value = result.data.userByUid

        // Identify user for LogRocket
        LogRocket.identify(customUser.value!.uid, {
          name: customUser.value!.fullname,
          email: customUser.value!.email,

          // Add your own custom user variables here
          role: customUser.value!.role,
        })

        resolve()
      }
    })
  })
}

const getDashboardPathForRole = (): string => {
  let path = '/'
  const role = customUser.value?.role
  if (role === Role.ADMIN) path = '/admin/dashboard'
  if (role === Role.EMPLOYEE) path = '/employee/dashboard'
  if (role === Role.CLIENT) path = '/client/dashboard'

  return path
}

export default () => {
  return {
    customUser,
    restoreCustomUser,
    getDashboardPathForRole,
  }
}
