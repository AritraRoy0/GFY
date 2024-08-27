import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRnXQmTPE5D-qPE9h6QCvrXmVRB3z5_fo",
  authDomain: "gofundyourself2024.firebaseapp.com",
  projectId: "gofundyourself2024",
  storageBucket: "gofundyourself2024.appspot.com",
  messagingSenderId: "377930925225",
  appId: "1:377930925225:web:ca31998fd00f5f2200d5b8",
  measurementId: "G-BEX7CFVGRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics only on the client-side
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Initialize Firestore
const firestore = getFirestore(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { analytics, firestore };
