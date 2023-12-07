import { Injectable } from '@nestjs/common'
import { App, applicationDefault, initializeApp } from 'firebase-admin/app'
import { Auth } from 'firebase-admin/lib/auth/auth'
import { getAuth } from 'firebase-admin/auth'
import { FirebaseUser } from '../models/firebase-user.model'
import { Storage } from '@google-cloud/storage'

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: App

  constructor() {
    this.firebaseApp = initializeApp({
      credential: applicationDefault(), // Environment variable GOOGLE_APPLICATION_CREDENTIALS
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    })
  }

  getAuth = (): Auth => getAuth()

  async removeUser(uid: string) {
    try {
      await getAuth().deleteUser(uid)
      return uid
    } catch (error) {
      throw new Error(`Error deleting firebase user: ${error}`)
    }
  }

  // Seeding functions
  async createUser(user: FirebaseUser) {
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

  async removeUsers() {
    try {
      const listUsersResult = await getAuth().listUsers()

      const uids = listUsersResult.users.map(user => user.uid)

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

  async removeStorageImages() {
    try {
      const bucketName = process.env.FIREBASE_STORAGE_BUCKET

      const storage = new Storage()

      await storage.bucket(bucketName).deleteFiles({
        force: true,
      })
    } catch (error) {
      throw new Error(`Error deleting storage images: ${error}`)
    }
  }
}
