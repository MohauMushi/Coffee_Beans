"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import Alert from "@/components/Alert";

export default function WishlistPage() {
  const { user } = useUser();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    try {
      const q = query(
        collection(db, "wishlist"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlistItems(items);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      setAlertConfig({
        isVisible: true,
        message: "Error loading wishlist items",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      await deleteDoc(doc(db, "wishlist", itemId));
      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
      setAlertConfig({
        isVisible: true,
        message: "Item removed from wishlist",
        type: "success",
      });
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      setAlertConfig({
        isVisible: true,
        message: "Error removing item",
        type: "error",
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
        <p className="text-gray-600">Please log in to view your wishlist.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Alert
        isVisible={alertConfig.isVisible}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() =>
          setAlertConfig((prev) => ({ ...prev, isVisible: false }))
        }
      />
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-4">${item.price.toFixed(2)}</p>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="flex items-center justify-center w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} className="mr-2" />
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
