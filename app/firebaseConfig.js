// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { initializeAuth, connectAuthEmulator, getReactNativePersistence} from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

//https://firebase.google.com/docs/auth/web/start

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

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
const functions = getFunctions(app);

// Connect to the Firestore emulator if running locally
if (true) {
    connectFirestoreEmulator(db, "localhost", 8080); // Use the port you set for Firestore
    connectFunctionsEmulator(functions, "localhost", 5001); // Use the port you set for Functions
    connectAuthEmulator(auth, "http://localhost:9099"); // Connect to the Auth emulator
}

export { db, auth, functions};