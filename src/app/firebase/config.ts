// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOViB17Le3axZ6bnTFtGKVAVulveu7rWo",
  authDomain: "reading-journal-a989c.firebaseapp.com",
  projectId: "reading-journal-a989c",
  storageBucket: "reading-journal-a989c.firebasestorage.app",
  messagingSenderId: "41982595066",
  appId: "1:41982595066:web:72ca701dcd39ed170f9e43",
  measurementId: "G-EMYTZD5QPH",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
