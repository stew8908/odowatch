// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfGQJJooOg8yzjWxs48sbWxlP4y06L9HI",
  authDomain: "odowatch.firebaseapp.com",
  projectId: "odowatch",
  storageBucket: "odowatch.firebasestorage.app",
  messagingSenderId: "303235252413",
  appId: "1:303235252413:web:799958dd1e79fd7a7cf7d4",
  measurementId: "G-Z33FY2TKR2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };