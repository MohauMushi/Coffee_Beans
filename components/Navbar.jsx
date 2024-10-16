"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ShoppingCart, User, ChevronDown } from "lucide-react";
import ShoppingCartModal from "./ShoppingCartModal";
import { auth, db, signOut } from "@/lib/firebaseConfig";
import Alert from "@/components/Alert";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const userMenuRef = useRef(null);
  const router = useRouter();
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(db, "cart"),
          where("userId", "==", currentUser.uid)
        );
        const cartUnsubscribe = onSnapshot(q, (querySnapshot) => {
          const count = querySnapshot.docs.reduce(
            (total, doc) => total + doc.data().quantity,
            0
          );
          setCartCount(count);
        });

        return () => cartUnsubscribe();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
      setAlertConfig({
        isVisible: true,
        message: "Successfully signed out",
        type: "success",
      });
    } catch (error) {
      setAlertConfig({
        isVisible: true,
        message: "Error signing out",
        type: "error",
      });
    }
  };

  const UserMenu = () => (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={toggleUserMenu}
        className="flex items-center space-x-1 p-2 text-black hover:bg-gray-100 rounded-full focus:outline-none"
      >
        <User size={24} />
        <ChevronDown className="h-4 w-4" />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  {user.email}
                </div>
                <Link
                  href="/account"
                  className="text-black hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Account
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-white shadow-md sticky z-50 top-0">
      <Alert
        isVisible={alertConfig.isVisible}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() =>
          setAlertConfig((prev) => ({ ...prev, isVisible: false }))
        }
      />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center rtl:space-x-reverse">
              <Image
                width={100}
                height={100}
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
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className="text-black hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-black hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-black hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
            >
              Contact
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-black hover:bg-gray-100 rounded-full focus:outline-none"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-black rounded-md hover:bg-gray-100 focus:outline-none mr-2"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
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
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
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
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/"
            className="text-black hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-black hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-black hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
          >
            Contact
          </Link>
          {user ? (
            <>
              <div className="px-3 py-2 text-sm text-gray-700">
                {user.email}
              </div>
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:bg-gray-100 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-black hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-black hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Shopping Cart Modal */}
      <ShoppingCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
