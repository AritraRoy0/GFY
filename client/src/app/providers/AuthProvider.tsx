"use client";

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../../firebaseConfig';
import { setUser, clearUser } from '../store';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
          dispatch(setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            ...(userDoc.exists() ? userDoc.data() : {})
          }));
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch(setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email
          }));
        }
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider; 