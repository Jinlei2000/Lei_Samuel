import { Injectable } from '@nestjs/common'
import { getAuth } from 'firebase-admin/auth'
import { App, applicationDefault, initializeApp } from 'firebase-admin/app'
import { FirebaseUser } from './models/firebase-user.model'

@Injectable()
export class FirebaseUsersService {
  private readonly firebaseApp: App
  constructor() {
    this.firebaseApp = initializeApp({
      credential: applicationDefault(), // Environment variable GOOGLE_APPLICATION_CREDENTIALS
    })
  }

  create(user: FirebaseUser) {
    getAuth()
      .createUser({
        email: user.email,
        password: user.password,
        uid: user.uid,
      })
      .then(userRecord => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid)

        return `Successfully created new user: ${userRecord.uid}`
      })
      .catch(error => {
        console.log('Error creating new user:', error)

        return `Error creating new user: ${error}`
      })
  }

  remove(uid: string) {
    getAuth()
      .deleteUser(uid)
      .then(() => {
        console.log('Successfully deleted user')
        return 'Successfully deleted user'
      })
      .catch(error => {
        console.log('Error deleting user:', error)
        return `Error deleting user: ${error}`
      })
  }

  removeAll(uids: string[]) {
    getAuth()
      .deleteUsers(uids)
      .then(deleteUsersResult => {
        console.log(
          `Successfully deleted ${deleteUsersResult.successCount} users`,
        )
        console.log(`Failed to delete ${deleteUsersResult.failureCount} users`)
        deleteUsersResult.errors.forEach(err => {
          console.log(err.error.toJSON())
        })

        return `Successfully deleted users`
      })
      .catch(error => {
        console.log('Error deleting users:', error)
        return `Error deleting users: ${error}`
      })
  }
}
