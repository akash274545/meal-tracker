import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmfKP5EaNXlV33K0jvx7gQBPpit29-T6Q",
  authDomain: "meal-tracker-19f45.firebaseapp.com",
  databaseURL:
    "https://meal-tracker-19f45-default-rtdb.firebaseio.com",
  projectId: "meal-tracker-19f45",
  storageBucket: "meal-tracker-19f45.firebasestorage.app",
  messagingSenderId: "84302326555",
  appId: "1:84302326555:web:2b5106c45bf358fc9641be",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();