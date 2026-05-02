import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        {/* Minimalist Smooth Spinner */}
        <div className="relative w-16 h-16">
          {/* Static Track */}
          <div className="absolute inset-0 rounded-full border-[3px] border-gray-100"></div>
          
          {/* Liquid Rotating Arc */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border-[3px] border-t-red-500 border-r-transparent border-b-transparent border-l-transparent"
          ></motion.div>

          {/* Second Offset Arc for Smoothness */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-2 rounded-full border-[2px] border-b-red-200 border-t-transparent border-r-transparent border-l-transparent opacity-50"
          ></motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 flex flex-col items-center"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            Uzzi Bitez
          </span>
          
          {/* Minimalist Progress Indicator */}
          <div className="mt-2 w-12 h-[1px] bg-gray-100 overflow-hidden relative">
            <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full bg-red-400/30"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
