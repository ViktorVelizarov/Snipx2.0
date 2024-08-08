"use client";  // This makes the file a client component

import React, { useState, createContext, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";  // Correct import for Next.js router in client components
import { initializeApp } from "firebase/app";
import axios from "axios";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB2FvUe6HabOJakyBvxqglg-TxO9SBkCt4",
  authDomain: "extension-360407.firebaseapp.com",
  projectId: "extension-360407",
  storageBucket: "extension-360407.appspot.com",
  messagingSenderId: "173150664134",
  appId: "1:173150664134:web:eda5d81c331ca3c2e2eec7",
  measurementId: "G-Q9FYTCBCT2",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();  // Use useRouter directly in a client component

  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth();

  const login = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await checkDatabase(res.user);
    } catch (err) {
      console.error(err);
      alert(err.message);
      router.push("/login");
    }
  };

  const checkDatabase = async (authResponse) => {
    const url = `${process.env.SERVER_URL}/api/auth/firebase`;
    try {
      const response = await axios.post(url, {
        idToken: authResponse.stsTokenManager.accessToken,
      });
      if (response.data.email) {
        setUser(response.data);
        router.push("/home");
      } else {
        alert("You don't have access :(");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  // Define the value provided to the AuthContext
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
