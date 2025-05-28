
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCJuBUuX6A3b1saC2ji9FRyOXzuhXJo1rg",
  authDomain: "fortfight-9c1af.firebaseapp.com",
  projectId: "fortfight-9c1af",
  storageBucket: "fortfight-9c1af.firebasestorage.app",
  messagingSenderId: "794589632688",
  appId: "1:794589632688:web:1f60751612aa16b0c74375",
  measurementId: "G-TG9L7F1MJC"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);