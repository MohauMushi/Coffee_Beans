"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/api";

const LoadingSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg p-4 shadow-sm border">
    {/* Image skeleton */}
    <div className="relative w-full mb-4">
      <div className="bg-gray-200 h-[200px] w-full rounded-lg mb-2"></div>
      {/* Heart icon skeleton */}
      <div className="absolute top-2 right-2 w-8 h-8 bg-gray-200 rounded-full"></div>
    </div>

    {/* Title skeleton */}
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>

    {/* Price and weight skeleton */}
    <div className="flex justify-between items-center mb-3">
      <div className="h-5 bg-gray-200 rounded w-20"></div>
      <div className="h-5 bg-gray-200 rounded w-16"></div>
    </div>

    {/* Flavor tags skeleton */}
    <div className="flex gap-2 mb-4">
      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      <div className="h-6 bg-gray-200 rounded-full w-24"></div>
    </div>

    {/* Add to Cart button skeleton */}
    <div className="h-10 bg-gray-200 rounded-md w-full"></div>
  </div>
);

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(20)].map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4" role="alert">
          {error}
        </p>
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
    return (
      <div className="text-center py-10" role="status">
        No products found.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
