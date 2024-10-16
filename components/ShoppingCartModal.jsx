"use client";

import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchCartItems(user.uid);
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

  const fetchCartItems = async (userId) => {
    const q = query(collection(db, "cart"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCartItems(items);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (!user) return;

    try {
      if (newQuantity <= 0) {
        await deleteProduct(itemId);
      } else {
        await updateDoc(doc(db, "cart", itemId), { quantity: newQuantity });
        fetchCartItems(user.uid);
        setAlertConfig({
          isVisible: true,
          message: "Cart updated successfully",
          type: "success",
        });
      }
    } catch (error) {
      setAlertConfig({
        isVisible: true,
        message: "Error updating cart",
        type: "error",
      });
    }
  };

  const deleteProduct = async (itemId) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "cart", itemId));
      fetchCartItems(user.uid);
      setAlertConfig({
        isVisible: true,
        message: "Item removed from cart",
        type: "success",
      });
    } catch (error) {
      setAlertConfig({
        isVisible: true,
        message: "Error removing item",
        type: "error",
      });
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
                        className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => deleteProduct(item.id)}
                        className="p-1 bg-red-200 rounded-full text-red-600 hover:bg-red-300"
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
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
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
