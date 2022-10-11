import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import Profile from "./models/Profile";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_API_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fireStoreDB = getFirestore(app);

const register = async (email, password) => {
  const response = await createUserWithEmailAndPassword(auth, email, password)

  return response.user.uid
}

const logInWithEmailAndPassword = async (email, password) => {
  const response = await signInWithEmailAndPassword(auth, email, password);

  return response.user.uid;
}

const logOut = () => {
  return signOut(auth)
}

export {
  auth,
  register,
  logInWithEmailAndPassword,
  logOut,
  fireStoreDB
};