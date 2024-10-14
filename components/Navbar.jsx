"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * @component Navbar
 * @description A responsive navigation bar component for the FluxStore application.
 * It includes a logo, navigation links, and icons for cart and account.
 * The component is responsive and includes a mobile menu for smaller screens.
 * @returns {JSX.Element} The rendered Navbar component
 */
const Navbar = () => {
  /** @type {[boolean, function]} State to control the mobile menu visibility */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggles the mobile menu open/closed state
   * @function
   */
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky z-50 top-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img
                src="/coffee&beans.svg"
                className="h-8"
                alt="FluxStore Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">
                Coffee&Beans
              </span>
            </Link>
          </div>

          {/* Desktop navigation menu */}
          <div className="hidden md:block">
            <div className="flex justify-center items-center space-x-4">
              {/* Navigation links */}
              <Link
                href="/"
                className="text-black hover:bg-gray-100 hover:text-black block px-3 py-1 rounded-md text-base font-medium md:m-0"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-black hover:bg-gray-100 hover:text-black block px-3 py-1 rounded-md text-base font-medium md:m-0"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-black hover:bg-gray-100 hover:text-black block px-3 py-1 rounded-md text-base font-medium md:m-0"
              >
                Contact
              </Link>

              {/* Cart icon */}
              <Link
                href="/cart"
                className="p-2 rounded-lg text-black hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </Link>

              {/* Account icon */}
              <Link
                href="/account"
                className="ml-3 p-2 rounded-lg text-black hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-black focus:outline-none"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Mobile navigation links */}
            <Link
              href="/"
              className="text-black hover:bg-gray-100 hover:text-black block px-3 py-1 rounded-md text-base font-medium md:m-0"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-black hover:bg-gray-100 hover:text-black block px-3 py-1 rounded-md text-base font-medium md:m-0"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-black hover:bg-gray-100 hover:text-black block px-3 py-1 rounded-md text-base font-medium md:m-0"
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              {/* Mobile cart icon */}
              <Link
                href="/cart"
                className="p-2 rounded-lg text-black hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </Link>
              {/* Mobile account icon */}
              <Link
                href="/account"
                className="ml-auto p-2 rounded-lg text-black hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
