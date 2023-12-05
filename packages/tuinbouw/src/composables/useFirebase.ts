import { initializeApp } from 'firebase/app'
import {
  type Auth,
  browserLocalPersistence,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as refStorage,
  uploadBytes,
  type UploadResult,
} from 'firebase/storage'
import { ref } from 'vue'

// Shared state
const app = initializeApp({
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
})

//#region Firebase Authentication
const auth: Auth = getAuth(app)

// When the emulator is running, connect to it
if (import.meta.env.VITE_EMULATION) {
  console.info('Firebase authentication emulator is running')
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
}

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
    signOut(auth)
      .then(() => {
        firebaseUser.value = null
        resolve()
      })
      .catch(error => {
        reject(error)
      })
  })
}

const register = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        firebaseUser.value = userCredential.user
        resolve(userCredential.user)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const forgotPassword = async (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
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
// #endregion

//# region Firebase Storage
const storage = getStorage(app)

const profileRef = (uid: string) =>
  refStorage(storage, `images/${uid}/profile.jpg`)

// upload a profile image and return the download url
const uploadProfile = async (uid: string, file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = profileRef(uid)
    uploadBytes(storageRef, file)
      .then((snapshot: UploadResult) => {
        console.log('Uploaded a blob or file!', snapshot)
        getDownloadURL(snapshot.ref)
          .then(url => {
            resolve(url.toString())
          })
          .catch(error => {
            reject(error)
          })
      })
      .catch(error => {
        reject(error)
      })
  })
}

// update the profile image
const updateProfile = async (
  uid: string,
  file: File | null = null,
): Promise<string | void> => {
  // if file is null, delete the profile image
  return new Promise((resolve, reject) => {
    const storageRef = profileRef(uid)
    if (file !== null) {
      uploadBytes(storageRef, file)
        .then((snapshot: UploadResult) => {
          console.log('Uploaded new profile image!', snapshot)
          getDownloadURL(snapshot.ref)
            .then(url => {
              resolve(url.toString())
            })
            .catch(error => {
              reject(error)
            })
        })
        .catch(error => {
          reject(error)
        })
    } else {
      deleteProfile(uid)
    }
  })
}

const deleteProfile = async (uid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const storageRef = profileRef(uid)
    deleteObject(storageRef)
      .then(() => {
        resolve()
      })
      .catch(error => {
        reject(error)
      })
  })
}

//# endregion

export default () => {
  // State for each composable
  return {
    firebaseUser,
    forgotPassword,
    login,
    logout,
    register,
    restoreUser,
    updateProfile,
    uploadProfile,
    deleteProfile,
  }
}
