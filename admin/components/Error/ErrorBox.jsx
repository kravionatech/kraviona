import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const ErrorBox = ({ error }) => {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="bg-white w-lg h-[400px]  flex flex-col items-center justify-center gap-5 p-5 rounded-2xl shadow-2xl"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{
          rotate: [0, -10, 10, -10, 10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.8,
          delay: 0.2,
        }}
      >
        <X size={60} className="text-red-500" />
      </motion.div>

      {/* Animated Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-semibold text-center text-gray-800"
      >
        {error?.message || "Something went wrong!"}
      </motion.h2>

      {/* Animated Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-gray-500 max-w-md"
      >
        Please try again later. If the problem persists, contact support.
      </motion.p>
    </motion.section>
  );
};

export default ErrorBox;