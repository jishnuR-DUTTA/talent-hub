// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration.
// This is a public configuration and is safe to be exposed.
const firebaseConfig = {
  "projectId": "talenthub-9njxw",
  "appId": "1:880852746543:web:cba7f55adebd99d041e1da",
  "storageBucket": "talenthub-9njxw.firebasestorage.app",
  "apiKey": "AIzaSyCyMZOdEOWzCAmmVFmqJxj2QGboZzAFQto",
  "authDomain": "talenthub-9njxw.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "880852746543"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };
