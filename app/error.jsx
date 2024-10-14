"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Error({ error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="fixed inset-0 flex items-center justify-center bg-white text-black p-4 overflow-hidden">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center">
          <motion.div
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          ></motion.div>
          <motion.h2
            className="mb-4 font-extrabold text-5xl sm:text-6xl md:text-7xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="sr-only">Error</span>Oops!
          </motion.h2>
          <motion.p
            className="mb-4 text-lg sm:text-xl md:text-2xl font-semibold"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Looks like our coffee machine is acting up!
          </motion.p>
          <motion.p
            className="mb-6 text-sm sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Don't worry, we're brewing up a solution. In the meantime, why not
            try returning to our homepage?
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Link href="/" className="inline-block">
              <motion.button
                className="px-6 py-2 font-semibold rounded border border-black text-black hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 transition-colors duration-200 w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Homepage
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
