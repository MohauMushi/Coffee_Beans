"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <UserContext.Provider value={{ user, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
