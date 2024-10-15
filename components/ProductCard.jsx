import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  if (!product) {
    return null;
  }

  const { id, name, image_url, price, weight, flavor_profile = [] } = product;

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
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
        <button className="flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors duration-300">
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
