// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, setPersistence, browserSessionPersistence, onAuthStateChanged, signInWithPopup, getRedirectResult, signInWithRedirect } from "firebase/auth";// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore";
import {getReactNativePersistence} from 'firebase/auth/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyBcn9YVdA5l7xzv73_Tzzojz0wzEkVvExE",
  authDomain: "event-management-2356d.firebaseapp.com",
  projectId: "event-management-2356d",
  storageBucket: "event-management-2356d.appspot.com",
  messagingSenderId: "479493627491",
  appId: "1:479493627491:web:af2cb4b58b3f85f3512256",
  measurementId: "G-GK3ZDPZ0CZ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

export const db = getFirestore(app);

