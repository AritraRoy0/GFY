'use client';

import React, { useState } from 'react';
import { auth, provider } from '../../../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate the form
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    } else {
      newErrors.username = '';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      valid = false;
    } else {
      newErrors.fullName = '';
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle Google Sign-Up and link with username and full name
  const handleGoogleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, uid } = result.user;

      // Link the username and full name with the Google account
      console.log(`Username: ${formData.username}, Full Name: ${formData.fullName}`);
      console.log(`Google Display Name: ${displayName}, Email: ${email}, UID: ${uid}`);
      
      // TODO: Implement backend API call to save the username, full name, email, and UID
      // Example:
      // await saveUserDataToDatabase(uid, formData.username, formData.fullName, email);

    } catch (error) {
      console.error('Error during Google Sign-Up:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <button
            className={`text-lg font-bold px-4 py-2 rounded-t-lg transition-colors duration-300 ${
              activeTab === 'signup' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`text-lg font-bold px-4 py-2 rounded-t-lg transition-colors duration-300 ${
              activeTab === 'login' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
        </div>

        {/* Form Content */}
        {activeTab === 'signup' && (
          <>
            <form className="mb-6">
              {/* Username Input */}
              <div className="mb-6">
                <label htmlFor="username" className="block text-gray-800 font-medium mb-2">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300`}
                  required
                />
                {errors.username && <div className="text-red-500 text-sm mt-2">{errors.username}</div>}
              </div>
              {/* Full Name Input */}
              <div className="mb-6">
                <label htmlFor="fullName" className="block text-gray-800 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300`}
                  required
                />
                {errors.fullName && <div className="text-red-500 text-sm mt-2">{errors.fullName}</div>}
              </div>
              {/* Sign Up with Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity duration-300 mt-4"
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up with Google'}
              </button>
            </form>
          </>
        )}

        {activeTab === 'login' && (
          <div className="mb-6">
            {/* No form fields for login */}
            {/* Only Google sign-in */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity duration-300"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
