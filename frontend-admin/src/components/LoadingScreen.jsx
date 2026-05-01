import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/Background.png";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-md">
      <div className="flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <img src={logo} alt="Uzzi Bitez" className="w-24 h-24 object-contain" />
          
          {/* Outer Ring Animation */}
          <motion.div 
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 border-4 border-red-500 rounded-full"
          />
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-gray-800 font-bold tracking-widest uppercase text-xs"
        >
          Uzzi Bitez
        </motion.p>
        <p className="text-gray-400 text-[10px] mt-1">Preparing your experience...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
