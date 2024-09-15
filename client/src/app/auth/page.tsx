// pages/auth.tsx or app/auth/page.tsx

'use client';

import React, { useReducer, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { auth, provider, firestore } from '../../../firebaseConfig'; // Adjust the path if necessary

import { useDispatch } from 'react-redux';
import { setUser, clearUser } from "../features/authSlice"; // Adjust the path
import { RootState } from '../store';

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
          email: email,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        {/* Alert Message */}
        {state.alertMessage && (
          <div
            className={`mb-4 p-4 rounded-lg text-center font-bold ${
              state.alertMessage.startsWith('Error') || state.alertMessage.startsWith('No account')
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'
            }`}
          >
            {state.alertMessage}
          </div>
        )}

        {/* Tabs for Login/Signup */}
        <div className="flex justify-center mb-8">
          <button
            className={`text-lg font-bold px-4 py-2 rounded-t-lg transition-colors duration-300 ${
              activeTab === 'signup'
                ? 'text-indigo-600 border-b-4 border-indigo-600 shadow-lg'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`text-lg font-bold px-4 py-2 rounded-t-lg transition-colors duration-300 ${
              activeTab === 'login'
                ? 'text-indigo-600 border-b-4 border-indigo-600 shadow-lg'
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
            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-800 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={state.formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-3 border text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300 ${
                  state.errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {state.errors.username && (
                <div className="text-red-500 text-sm mt-2">{state.errors.username}</div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="fullName" className="block text-gray-800 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={state.formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300 ${
                  state.errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {state.errors.fullName && (
                <div className="text-red-500 text-sm mt-2">{state.errors.fullName}</div>
              )}
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity duration-300 mt-4"
              disabled={state.loading}
            >
              {state.loading ? 'Signing up...' : 'Sign Up with Google'}
            </button>
          </form>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="mb-6">
            <button
              onClick={handleGoogleSignUp}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity duration-300"
              disabled={state.loading}
            >
              {state.loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
