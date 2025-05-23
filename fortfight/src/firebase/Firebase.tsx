// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJuBUuX6A3b1saC2ji9FRyOXzuhXJo1rg",
  authDomain: "fortfight-9c1af.firebaseapp.com",
  projectId: "fortfight-9c1af",
  storageBucket: "fortfight-9c1af.firebasestorage.app",
  messagingSenderId: "794589632688",
  appId: "1:794589632688:web:1f60751612aa16b0c74375",
  measurementId: "G-TG9L7F1MJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);