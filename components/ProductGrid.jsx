"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/api";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 h-64 rounded-lg"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center py-10">No products found.</div>;
  }

  return (
    <div>
      {products.length === 0 && !error ? (
        <div className="text-center text-red-500 py-10">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
