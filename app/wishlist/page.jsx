"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  addDoc,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";
import { Trash2, ShoppingCart } from "lucide-react";
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

  const fetchWishlistItems = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
      setIsLoading(false);
    }
  }, [user, fetchWishlistItems]);

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

  const handleAddToCart = async (item) => {
    if (!user) {
      setAlertConfig({
        isVisible: true,
        message: "Please log in to add items to cart",
        type: "error",
      });
      return;
    }

    try {
      const cartRef = collection(db, "cart");
      const q = query(
        cartRef,
        where("userId", "==", user.uid),
        where("productId", "==", item.productId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(cartRef, {
          userId: user.uid,
          productId: item.productId,
          name: item.name,
          price: item.price,
          image_url: item.image_url,
          quantity: 1,
        });
      } else {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          quantity: querySnapshot.docs[0].data().quantity + 1,
        });
      }

      setAlertConfig({
        isVisible: true,
        message: "Item added to cart successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setAlertConfig({
        isVisible: true,
        message: "Error adding item to cart",
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
                <div className="p-4 flex flex-col sm:flex-row justify-between gap-4 m-2 rounded-lg shadow-inner">
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors w-full sm:w-auto"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Remove from Wishlist
                  </button>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors w-full sm:w-auto"
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
