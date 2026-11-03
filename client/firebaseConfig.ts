import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import {
  Auth,
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
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

// Initialize Firebase Analytics only on the client-side, once the page has loaded and the main thread is idle,
// so the Google Analytics script doesn't compete with first paint and hydration (Core Web Vitals).
let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  const startAnalytics = () => {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  };
  const startWhenIdle = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(startAnalytics, { timeout: 4000 });
    } else {
      setTimeout(startAnalytics, 2000);
    }
  };
  if (document.readyState === 'complete') {
    startWhenIdle();
  } else {
    window.addEventListener('load', startWhenIdle, { once: true });
  }
}

// Initialize Firestore
const firestore = getFirestore(app);

// The app signs in with email/password only. initializeAuth without a popup/redirect resolver keeps Google's
// auth iframe and apis.google.com from loading on every page. Persistence matches getAuth()'s defaults, so
// existing sessions carry over. If popup or redirect sign-in is added, pass browserPopupRedirectResolver here.
function createAuth(): Auth {
  if (typeof window === 'undefined') return getAuth(app);
  try {
    return initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
    });
  } catch {
    // Already initialized (e.g. after a hot reload in development).
    return getAuth(app);
  }
}

export const auth = createAuth();
export const provider = new GoogleAuthProvider();
export { analytics, firestore };
