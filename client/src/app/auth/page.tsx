"use client";

import React, { useState } from 'react';

const AuthForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(`Field updated: ${name}, Value: ${value}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform hover:scale-105 transition-transform duration-500">
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

        {activeTab === 'signup' ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-800 font-medium mb-2">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors duration-300"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-800 font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors duration-300"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-800 font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors duration-300"
                required
              />
            </div>
            <div className="mb-8">
              <label htmlFor="confirmPassword" className="block text-gray-800 font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors duration-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity duration-300"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-800 font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors duration-300"
                required
              />
            </div>
            <div className="mb-8">
              <label htmlFor="password" className="block text-gray-800 font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors duration-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity duration-300"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
