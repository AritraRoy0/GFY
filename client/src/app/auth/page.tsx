// or app/auth/page.tsx

'use client';

import React, { useReducer, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { auth, provider, firestore } from '../../../firebaseConfig'; // Adjust the path if necessary

import { useDispatch } from 'react-redux';
import { setUser, clearUser } from "../features/authSlice"; // Adjust the path
import { FaGoogle } from 'react-icons/fa';

// Define interfaces
interface FormData {
  username: string;
  fullName: string;
}

interface Errors {
  username: string;
  fullName: string;
}

interface State {
  formData: FormData;
  errors: Errors;
  loading: boolean;
  alertMessage: string | null;
}

interface Action {
  type: string;
  payload?: any;
}

// Action constants
const ACTIONS = {
  SET_ERRORS: 'SET_ERRORS',
  SET_LOADING: 'SET_LOADING',
  SET_ALERT: 'SET_ALERT',
  SET_FORM_DATA: 'SET_FORM_DATA',
};

// Reducer function
const formReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTIONS.SET_ERRORS:
      return { ...state, errors: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ALERT:
      return { ...state, alertMessage: action.payload };
    case ACTIONS.SET_FORM_DATA:
      return { ...state, formData: action.payload };
    default:
      return state;
  }
};

const AuthPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');

  // Manage state with useReducer
  const [state, localDispatch] = useReducer(formReducer, {
    formData: { username: '', fullName: '' },
    errors: { username: '', fullName: '' },
    loading: false,
    alertMessage: null,
  });

  useEffect(() => {
    // Get the 'tab' parameter from URL
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    setActiveTab(tabParam === 'login' ? 'login' : 'signup');
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const { displayName, email, uid } = firebaseUser;

        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', uid));
        let userData = {};

        if (userDoc.exists()) {
          userData = userDoc.data();
        }

        const fullUserData = {
          id: uid,
          name: displayName,
          email: email,
          ...userData,
        };

        // Dispatch setUser action
        dispatch(setUser(fullUserData));
      } else {
        // User is signed out
        dispatch(clearUser());
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [dispatch]);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    localDispatch({ type: ACTIONS.SET_FORM_DATA, payload: { ...state.formData, [name]: value } });
  };

  // Form validation
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { ...state.errors };

    if (!state.formData.username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    } else {
      newErrors.username = '';
    }

    if (!state.formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    } else {
      newErrors.fullName = '';
    }

    localDispatch({ type: ACTIONS.SET_ERRORS, payload: newErrors });
    return valid;
  };

  // Check if username exists in Firestore
  const checkUsernameExists = async (username: string): Promise<boolean> => {
    const q = query(collection(firestore, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  // Handle Google sign-up/sign-in
  const handleGoogleSignUp = async () => {
    if (activeTab === 'signup' && !validateForm()) return;

    localDispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { displayName, email, uid } = user;

      if (activeTab === 'signup') {
        const usernameExists = await checkUsernameExists(state.formData.username);
        if (usernameExists) {
          localDispatch({
            type: ACTIONS.SET_ERRORS,
            payload: { ...state.errors, username: 'Username already taken' },
          });
          localDispatch({ type: ACTIONS.SET_LOADING, payload: false });
          return;
        }

        // Save user data in Firestore
        const userData = {
          username: state.formData.username,
          fullName: state.formData.fullName,
          email: email,
        };

        await setDoc(doc(firestore, 'users', uid), userData);

        // Dispatch setUser action
        dispatch(setUser({
          id: uid,
          name: displayName,
          ...userData,
        }));

        localDispatch({ type: ACTIONS.SET_ALERT, payload: 'Sign-up successful!' });
        router.push('/dashboard');
      } else {
        const userDoc = await getDoc(doc(firestore, 'users', uid));
        if (!userDoc.exists()) {
          localDispatch({ type: ACTIONS.SET_ALERT, payload: 'No account found. Please sign up first.' });
          await auth.signOut();
          localDispatch({ type: ACTIONS.SET_LOADING, payload: false });
          return;
        }

        const userData = userDoc.data();

        // Dispatch setUser action
        dispatch(setUser({
          id: uid,
          name: displayName,
          email: email,
          ...userData,
        }));

        localDispatch({ type: ACTIONS.SET_ALERT, payload: 'Logged in successfully!' });
        router.push('/dashboard');
      }
    } catch (error) {
      localDispatch({ type: ACTIONS.SET_ALERT, payload: 'Error during authentication. Please try again.' });
      console.error('Error during Google Sign-Up/Sign-In:', error);
    } finally {
      localDispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-60 animate-parallax"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="absolute top-0 left-0 w-32 h-32 opacity-20 animate-rotate-scale" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4V2m8.49 4.078L21 6m-1.49 8.489L20 18m-8-8V2m-8 8v8m-2 0h8m-6.5-6.5L4 6m0 12l1.5-1.5M18 6l-1.5 1.5M18 18l1.5-1.5" />
          </svg>
          <svg className="absolute top-0 right-0 w-48 h-48 opacity-20 animate-rotate-scale" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h12V5H6z" />
          </svg>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 opacity-10 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-full h-full animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2 2m0 0l2-2m-2 2V4m6 8l2 2m0 0l2-2m-2 2V4m6 8l2 2m0 0l2-2m-2 2V4" />
            </svg>
          </div>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="relative bg-white p-12 rounded-lg shadow-lg w-full max-w-md z-10">
        {/* Alert Message */}
        {state.alertMessage && (
          <div
            className={`mb-4 p-4 rounded-lg text-center font-bold transition-transform transform ${
              state.alertMessage.startsWith('Error') || state.alertMessage.startsWith('No account')
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'
            } ${
              state.alertMessage.startsWith('Error') || state.alertMessage.startsWith('No account')
                ? 'animate-shake'
                : 'animate-bounce'
            }`}
          >
            {state.alertMessage}
          </div>
        )}
  
        {/* Tabs for Login/Signup */}
        <div className="flex justify-center mb-8">
          <button
            className={`text-lg font-bold px-6 py-3 rounded-t-lg transition-colors duration-300 ${
              activeTab === 'signup'
                ? 'text-blue-600 border-b-4 border-blue-600 shadow-lg transform scale-105'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`text-lg font-bold px-6 py-3 rounded-t-lg transition-colors duration-300 ${
              activeTab === 'login'
                ? 'text-blue-600 border-b-4 border-blue-600 shadow-lg transform scale-105'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
        </div>
  
        {/* Signup Form */}
        {activeTab === 'signup' && (
          <form className="mb-6">
            <div className="relative mb-6">
              <input
                type="text"
                id="username"
                name="username"
                value={state.formData.username}
                onChange={handleChange}
                className={`peer w-full px-4 py-3 border text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform duration-300 ${
                  state.errors.username ? 'border-red-500 animate-shake' : 'border-gray-300'
                }`}
                required
              />
              <label
                htmlFor="username"
                className="absolute top-3 left-4 text-gray-700 peer-focus:-top-2 peer-focus:text-blue-600 transition-transform duration-300"
              >
                Username
              </label>
              {state.errors.username && (
                <div className="text-red-500 text-sm mt-2">{state.errors.username}</div>
              )}
            </div>
  
            <div className="relative mb-6">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={state.formData.fullName}
                onChange={handleChange}
                className={`peer w-full px-4 py-3 border text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform duration-300 ${
                  state.errors.fullName ? 'border-red-500 animate-shake' : 'border-gray-300'
                }`}
                required
              />
              <label
                htmlFor="fullName"
                className="absolute top-3 left-4 text-gray-700 peer-focus:-top-2 peer-focus:text-blue-600 transition-transform duration-300"
              >
                Full Name
              </label>
              {state.errors.fullName && (
                <div className="text-red-500 text-sm mt-2">{state.errors.fullName}</div>
              )}
            </div>
  
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-300 mt-4 transform hover:scale-105"
              disabled={state.loading}
            >
              <FaGoogle className="mr-3 text-lg" />
              {state.loading ? 'Signing up...' : 'Sign Up with Google'}
            </button>
          </form>
        )}
  
        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="mb-6">
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
              disabled={state.loading}
            >
              <FaGoogle className="mr-3 text-lg" />
              {state.loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
