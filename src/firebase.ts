// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


export const firebaseConfig = {
    apiKey: "AIzaSyCAd-FF5SWLEkpWMnzxPSPtv6-Qj2NpRnI",
    authDomain: "urscholartime.firebaseapp.com",
    projectId: "urscholartime",
    storageBucket: "urscholartime.firebasestorage.app",
    messagingSenderId: "653606678764",
    appId: "1:653606678764:web:c7b2aa8be4cebdfb7335c9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
