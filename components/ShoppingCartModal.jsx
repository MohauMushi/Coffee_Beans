"use client";

import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import Alert from "@/components/Alert";

const ShoppingCartModal = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const modalRef = useRef(null);
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // Setup real-time listener for cart items
        const q = query(
          collection(db, "cart"),
          where("userId", "==", user.uid)
        );
        const unsubscribeCart = onSnapshot(
          q,
          (snapshot) => {
            const items = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setCartItems(items);
          },
          (error) => {
            console.error("Error fetching cart items:", error);
            setAlertConfig({
              isVisible: true,
              message: "Error loading cart items",
              type: "error",
            });
          }
        );

        // Cleanup listener when user changes
        return () => unsubscribeCart();
      } else {
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      if (newQuantity <= 0) {
        await deleteProduct(itemId);
      } else {
        const cartItemRef = doc(db, "cart", itemId);
        await updateDoc(cartItemRef, { quantity: newQuantity });
        setAlertConfig({
          isVisible: true,
          message: "Cart updated successfully",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      setAlertConfig({
        isVisible: true,
        message: "Error updating cart",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (itemId) => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      const cartItemRef = doc(db, "cart", itemId);
      await deleteDoc(cartItemRef);

      // Verify the item was deleted by checking if it still exists in cartItems
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      if (updatedItems.length !== cartItems.length) {
        setAlertConfig({
          isVisible: true,
          message: "Item removed from cart",
          type: "success",
        });
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setAlertConfig({
        isVisible: true,
        message: "Error removing item",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50">
      <Alert
        isVisible={alertConfig.isVisible}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() =>
          setAlertConfig((prev) => ({ ...prev, isVisible: false }))
        }
      />
      <div
        ref={modalRef}
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between mb-4"
                  >
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={isLoading}
                        className={`p-1 bg-gray-200 rounded-full hover:bg-gray-300 ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={isLoading}
                        className={`p-1 bg-gray-200 rounded-full hover:bg-gray-300 ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => deleteProduct(item.id)}
                        disabled={isLoading}
                        className={`p-1 bg-red-200 rounded-full text-red-600 hover:bg-red-300 ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t p-6">
              <div className="mb-4">
                <p className="text-lg font-semibold">
                  Total: ${totalPrice.toFixed(2)}
                </p>
              </div>
              <button
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartModal;
