'use client';

import React, { useReducer, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Import useRouter
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { auth, provider, firestore } from '../../../firebaseConfig'; // Adjust the import path if necessary

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

const ACTIONS = {
  SET_ERRORS: 'SET_ERRORS',
  SET_LOADING: 'SET_LOADING',
  SET_ALERT: 'SET_ALERT',
  SET_FORM_DATA: 'SET_FORM_DATA',
};

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

const Auth: React.FC = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'login' ? 'login' : 'signup';

  const [activeTab, setActiveTab] = useState<'signup' | 'login'>(initialTab);
  const [state, dispatch] = useReducer(formReducer, {
    formData: { username: '', fullName: '' },
    errors: { username: '', fullName: '' },
    loading: false,
    alertMessage: null,
  });

  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    // Update activeTab if tabParam changes
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: ACTIONS.SET_FORM_DATA, payload: { ...state.formData, [name]: value } });
  };

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

    dispatch({ type: ACTIONS.SET_ERRORS, payload: newErrors });
    return valid;
  };

  const checkUsernameExists = async (username: string): Promise<boolean> => {
    const q = query(collection(firestore, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const checkUserExists = async (uid: string): Promise<boolean> => {
    const userDoc = await getDoc(doc(firestore, 'users', uid));
    return userDoc.exists();
  };

  const handleGoogleSignUp = async () => {
    if (activeTab === 'signup' && !validateForm()) return;

    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, uid } = result.user;

      if (activeTab === 'signup') {
        const usernameExists = await checkUsernameExists(state.formData.username);
        if (usernameExists) {
          dispatch({
            type: ACTIONS.SET_ERRORS,
            payload: { ...state.errors, username: 'Username already taken' },
          });
          dispatch({ type: ACTIONS.SET_LOADING, payload: false });
          return;
        }

        await setDoc(doc(firestore, 'users', uid), {
          username: state.formData.username,
          fullName: state.formData.fullName,
          email: email,
        });

        dispatch({ type: ACTIONS.SET_ALERT, payload: 'Sign-up successful!' });
        console.log(`Username: ${state.formData.username}, Full Name: ${state.formData.fullName}`);
        console.log(`Google Display Name: ${displayName}, Email: ${email}, UID: ${uid}`);

        // Redirect to dashboard after signup
        router.push('/dashboard');

      } else {
        const userExists = await checkUserExists(uid);
        if (!userExists) {
          dispatch({
            type: ACTIONS.SET_ALERT,
            payload: 'No account found. Please sign up first.',
          });
          await auth.signOut();
          dispatch({ type: ACTIONS.SET_LOADING, payload: false });
          return;
        }
        dispatch({ type: ACTIONS.SET_ALERT, payload: 'Logged in successfully!' });
        console.log(`Logged in with Google. Display Name: ${displayName}, Email: ${email}, UID: ${uid}`);

        // Redirect to dashboard after login
        router.push('/dashboard');
      }
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ALERT, payload: 'Error during authentication. Please try again.' });
      console.error('Error during Google Sign-Up/Sign-In:', error);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
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

        {/* Tabs */}
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

        {/* Form Content */}
        {activeTab === 'signup' && (
          <form className="mb-6">
            {/* Username Input */}
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
            {/* Full Name Input */}
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
            {/* Sign Up with Google Button */}
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

        {activeTab === 'login' && (
          <div className="mb-6">
            {/* Sign In with Google Button */}
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

export default Auth;
