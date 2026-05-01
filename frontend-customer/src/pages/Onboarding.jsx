import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Video from "../assets/Uzzibites.mp4";
import Logo from "../assets/logo.svg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={Video} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/90"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <img
            src={Logo}
            alt="Uzzi Bites Logo"
            className="h-24 w-24 object-contain"
          />
        </motion.div>

        {/* Welcome Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: [0, -10, 0], // float up & down
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-4xl md:text-6xl font-bold"
        >
          Welcome to Uzzi Bites
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.7, 1, 0.7], // fade in/out loop
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-4 max-w-xl text-lg md:text-2xl text-gray-200"
        >
          Where every meal becomes a memorable experience filled with comfort,
          flavor, and enjoyment.
        </motion.p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-10 rounded-full bg-red-500 px-8 py-4 text-lg font-semibold shadow-lg"

          onClick={() => {
            window.location.href = "/login";
          }}
        >
          Start Placing Order
        </motion.button>
      </div>
    </div>
  );
};

export default Onboarding;