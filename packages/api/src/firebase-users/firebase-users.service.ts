import { Injectable } from '@nestjs/common'
import { getAuth } from 'firebase-admin/auth'
import { FirebaseUser } from './models/firebase-user.model'

@Injectable()
export class FirebaseUsersService {
  async remove(uid: string) {
    try {
      await getAuth().deleteUser(uid)
      return uid
    } catch (error) {
      throw new Error(`Error deleting firebase user: ${error}`)
    }
  }

  // Seeding functions
  async create(user: FirebaseUser) {
    try {
      const userRecord = await getAuth().createUser({
        email: user.email,
        password: user.password,
        uid: user.uid,
      })

      return {
        uid: userRecord.uid,
        email: userRecord.email,
      }
    } catch (error) {
      throw new Error(`Error creating firebase user: ${error}`)
    }
  }

  async removeAll(uids: string[]) {
    try {
      const deleteUsersResult = await getAuth().deleteUsers(uids)

      console.log(
        `Successfully deleted ${deleteUsersResult.successCount} users`,
      )
      console.log(`Failed to delete ${deleteUsersResult.failureCount} users`)

      deleteUsersResult.errors.forEach(err => {
        console.log(err.error.toJSON())
      })

      return deleteUsersResult
    } catch (error) {
      throw new Error(`Error deleting users: ${error}`)
    }
  }
}
