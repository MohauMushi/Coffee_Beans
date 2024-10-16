"use client";

import React, { useState } from "react";
import { auth, signOut } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alert";

const SignOut = () => {
  const router = useRouter();
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAlert({
        show: true,
        message: "Successfully signed out!",
        type: "success",
      });
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      setAlert({
        show: true,
        message: "Error signing out. Please try again.",
        type: "error",
      });
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <Alert
        message={alert.message}
        type={alert.type}
        isVisible={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
      />
      <button onClick={handleSignOut}>Sign Out</button>
    </>
  );
};

export default SignOut;
