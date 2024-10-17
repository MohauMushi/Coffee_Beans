"use client";

import { useState, useEffect } from "react";
import { getProduct } from "@/lib/api";
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

export default function ProductDetails({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProduct(id);
        const fetchedProduct = Array.isArray(productData)
          ? productData[0]
          : productData;

        if (!fetchedProduct) {
          throw new Error("Product not found in the response");
        }

        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

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
          name: product.name,
          price: product.price,
          quantity: 1,
          image_url: product.image_url,
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  const {
    name,
    image_url,
    price,
    weight,
    description,
    flavor_profile = [],
    grind_option = [],
    roast_level,
    region,
  } = product;

  return (
    <div className="px-4 py-8">
      <Alert
        isVisible={alertConfig.isVisible}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() =>
          setAlertConfig((prev) => ({ ...prev, isVisible: false }))
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="relative">
          {image_url ? (
            <Image
              src={image_url}
              alt={name || "Product image"}
              width={300}
              height={300}
              priority
              className="flex h-[25rem] w-[35rem] justify-center items-center object-contain"
            />
          ) : (
            <div className="flex justify-center items-center h-full bg-gray-200 text-gray-400">
              No image available
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{name}</h1>
          <p className="text-xl font-semibold mb-2">
            ${(price || 0).toFixed(2)}
          </p>
          <p className="text-gray-600 mb-4">{weight}g</p>
          <p className="mb-4">{description}</p>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Flavor Profile:</h2>
            <div className="flex flex-wrap gap-2">
              {flavor_profile.map((flavor, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {flavor}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Grind Options:</h2>
            <div className="flex flex-wrap gap-2">
              {grind_option.map((option, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
          <p className="mb-2">
            <strong>Region:</strong> {region}
          </p>
          <p className="mb-4">
            <strong>Roast Level:</strong> {roast_level}/5
          </p>
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-md transition-colors duration-300"
          >
            <ShoppingCart size={20} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
