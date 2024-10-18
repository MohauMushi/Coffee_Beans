"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseConfig";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import Alert from "@/components/Alert";

const AccountPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [alert, setAlert] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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

  const validatePasswordForm = () => {
    if (!formData.currentPassword) {
      showAlert("Current password is required.", "error");
      return false;
    }
    if (!formData.newPassword) {
      showAlert("New password is required.", "error");
      return false;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      showAlert("New passwords do not match.", "error");
      return false;
    }
    if (formData.newPassword.length < 6) {
      showAlert("New password must be at least 6 characters long.", "error");
      return false;
    }
    return true;
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    hideAlert();

    if (!validatePasswordForm()) return;

    try {
      // Reauthenticate
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, formData.newPassword);
      showAlert("Password updated successfully.", "success");

      // Clear sensitive form data
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      handleUpdateError(error);
    }
  };

  const handleUpdateError = (error) => {
    console.error("Update error:", error);
    let errorMessage = "An error occurred while updating your password.";

    switch (error.code) {
      case "auth/requires-recent-login":
        errorMessage = "Please sign in again before making these changes.";
        break;
      case "auth/weak-password":
        errorMessage = "Password should be at least 6 characters long.";
        break;
      case "auth/wrong-password":
        errorMessage = "Current password is incorrect.";
        break;
      default:
        errorMessage = `Error updating password: ${error.message}`;
    }

    showAlert(errorMessage, "error");
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      showAlert(`Error signing out: ${error.message}`, "error");
    }
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
            Update Password
          </h2>

          <form onSubmit={handleUpdatePassword} className="mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Current Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                id="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                id="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                id="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={() => setShowPasswords(!showPasswords)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Show Passwords</span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Password
            </button>
          </form>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
