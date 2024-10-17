"use client"

import { useState } from "react";
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
} from "firebase/firestore";
import Alert from "@/components/Alert";

export default function ProductCard({ product }) {
  const { user } = useUser();
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  if (!product) {
    return null;
  }

  const { id, name, image_url, price, weight, flavor_profile = [] } = product;

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
        <Link href={`/product/${id}`} className="block relative">
          <div className="absolute top-2 right-2 rounded-full z-10 bg-slate-50">
            <button
              onClick={handleHeartClick}
              className="p-2 rounded-full transition-colors duration-300 bg-opacity-50 hover:bg-opacity-100"
            >
              <svg
                className="h-6 w-6 text-gray-600 hover:text-red-500 hover:fill-red-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                />
              </svg>
            </button>
          </div>
          <div className="relative h-64 shadow-inner m-2 rounded">
            <Image
              src={image_url}
              alt={name || "Product image"}
              width={300}
              height={300}
              className="flex justify-center items-center transition-transform duration-300 object-contain hover:scale-105"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
              {name || "Unnamed Product"}
            </h2>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">
                ${(price || 0).toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">{weight || "N/A"}g</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {flavor_profile.map((flavor, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {flavor}
                </span>
              ))}
            </div>
          </div>
        </Link>
        <div className="p-4 flex justify-end m-2 rounded-lg shadow-inner">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors duration-300"
          >
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
