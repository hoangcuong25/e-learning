"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import logo from "@public/logo.png"; // đổi sang logo của bạn nếu cần

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      {/* Logo xoay nhẹ */}
      <motion.div
        className="w-24 h-24 mb-6"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
      >
        <Image
          src={logo}
          alt="App Logo"
          className="w-full h-full object-contain"
          priority
        />
      </motion.div>

      {/* Thanh loading */}
      <motion.div
        className="w-48 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-full bg-blue-500 rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Dòng chữ */}
      <motion.p
        className="mt-4 text-gray-600 dark:text-gray-300 text-sm font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      >
        Đang tải, vui lòng chờ...
      </motion.p>
    </div>
  );
};

export default LoadingScreen;
