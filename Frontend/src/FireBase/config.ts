
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyCLgzQlrwgw1JHDJEFIj2X9Z3PZ_UxMhbE",
  authDomain: "flamezero-429e7.firebaseapp.com",
  projectId: "flamezero-429e7",
  storageBucket: "flamezero-429e7.firebasestorage.app",
  messagingSenderId: "673445404109",
  appId: "1:673445404109:web:b894191c738411734cf884",
  measurementId: "G-8PM0YWH2WN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)