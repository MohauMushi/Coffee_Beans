"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import Alert from "@/components/Alert";

export default function ProductCard({ product }) {
  const { user } = useUser();
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !product) return;

      try {
        const q = query(
          collection(db, "wishlist"),
          where("userId", "==", user.uid),
          where("productId", "==", product.id)
        );
        const querySnapshot = await getDocs(q);
        setIsInWishlist(!querySnapshot.empty);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [user, product]);

  if (!product) {
    return null;
  }

  const { id, name, image_url, price, weight, flavor_profile = [] } = product;

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setAlertConfig({
        isVisible: true,
        message: "Please log in to add items to wishlist",
        type: "error",
      });
      return;
    }

    try {
      const wishlistRef = collection(db, "wishlist");
      const q = query(
        wishlistRef,
        where("userId", "==", user.uid),
        where("productId", "==", id)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(wishlistRef, {
          userId: user.uid,
          productId: id,
          name,
          price,
          image_url,
        });
        setIsInWishlist(true);
        setAlertConfig({
          isVisible: true,
          message: "Item added to wishlist",
          type: "success",
        });
      } else {
        const docRef = querySnapshot.docs[0].ref;
        await deleteDoc(docRef);
        setIsInWishlist(false);
        setAlertConfig({
          isVisible: true,
          message: "Item removed from wishlist",
          type: "success",
        });
      }
    } catch (error) {
      setAlertConfig({
        isVisible: true,
        message: "Error updating wishlist",
        type: "error",
      });
    }
  };

  const handleAddToCart = async () => {
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
        where("productId", "==", id)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(cartRef, {
          userId: user.uid,
          productId: id,
          name,
          price,
          image_url,
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
      setAlertConfig({
        isVisible: true,
        message: "Error adding item to cart",
        type: "error",
      });
    }
  };

  return (
    <>
      <Alert
        isVisible={alertConfig.isVisible}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() =>
          setAlertConfig((prev) => ({ ...prev, isVisible: false }))
        }
      />
      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full">
        <Link href={`/product/${id}`} className="flex-1">
          <div className="relative">
            {/* Wishlist button */}
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={handleHeartClick}
                className="p-2 rounded-full transition-colors duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                aria-label={
                  isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                    isInWishlist
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={isInWishlist ? "0" : "2"}
                  fill={isInWishlist ? "currentColor" : "none"}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </button>
            </div>

            {/* Product Image */}
            <div className="relative h-40 sm:h-48 md:h-52 lg:h-56 shadow-inner m-2 rounded">
              <Image
                src={image_url}
                alt={name || "Product image"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Product Info */}
            <div className="p-3 sm:p-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                {name || "Unnamed Product"}
              </h2>

              <div className="flex justify-between items-center mb-2">
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  ${(price || 0).toFixed(2)}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  {weight || "N/A"}g
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {flavor_profile.map((flavor, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap"
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>

        {/* Add to Cart Button */}
        <div className="p-3 sm:p-4 mt-auto m-2 rounded-lg shadow-inner">
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors duration-300"
          >
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
