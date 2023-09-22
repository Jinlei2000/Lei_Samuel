import { ref } from 'vue'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'

// Shared state
const app = initializeApp({
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
})

const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence) // Local persistence is default (keep track of logged in user in the browser)

const firebaseUser = ref<User | null>(auth.currentUser)

const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        firebaseUser.value = userCredential.user
        resolve(userCredential.user)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const logout = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    auth
      .signOut()
      .then(() => {
        firebaseUser.value = null
        resolve()
      })
      .catch(error => {
        reject(error)
      })
  })
}

const restoreUser = async (): Promise<User | null> => {
  return new Promise(resolve => {
    onAuthStateChanged(auth, user => {
      if (user) {
        firebaseUser.value = user
        resolve(user)
      } else {
        firebaseUser.value = null
        resolve(null)
      }
    })
  })
}

export default () => {
  // State for each composable
  return {
    firebaseUser,
    login,
    logout,
    restoreUser,
  }
}
