"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebaseConfig";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import Alert from "@/components/Alert";

const AccountPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    currentPassword: "",
  });
  const [alert, setAlert] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData((prev) => ({ ...prev, email: currentUser.email }));
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const showAlert = (message, type = "success") => {
    setAlert({
      message,
      type,
      isVisible: true,
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, isVisible: false }));
  };

  const validateForm = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      showAlert("Passwords do not match.", "error");
      return false;
    }
    if (!formData.currentPassword) {
      showAlert("Current password is required.", "error");
      return false;
    }
    return true;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    hideAlert();

    if (!validateForm()) return;

    try {
      // First, reauthenticate the user
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update email if changed
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);

        // Update email in Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          email: formData.email,
        });
      }

      // Update password if provided
      if (formData.password) {
        await updatePassword(user, formData.password);
      }

      showAlert("Profile updated successfully.", "success");
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        currentPassword: "",
      }));
    } catch (error) {
      console.error("Update error:", error);
      let errorMessage = "An error occurred while updating your profile.";

      switch (error.code) {
        case "auth/requires-recent-login":
          errorMessage = "Please sign in again before making these changes.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "This email is already in use by another account.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters long.";
          break;
        case "auth/wrong-password":
          errorMessage = "Current password is incorrect.";
          break;
        default:
          errorMessage = `Error updating profile: ${error.message}`;
      }

      showAlert(errorMessage, "error");
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      showAlert(`Error signing out: ${error.message}`, "error");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Alert
        message={alert.message}
        type={alert.type}
        isVisible={alert.isVisible}
        onClose={hideAlert}
      />
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Account Settings
          </h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="currentPassword"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Current Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={toggleShowPassword}
                className="mr-2"
              />
              <label htmlFor="showPassword" className="text-sm text-gray-700">
                Show Password
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign Out
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
