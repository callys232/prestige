"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";

const HeroSection = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-16 px-4 text-white overflow-hidden"
      style={{ backgroundImage: "url('/Hero.png')" }}
    >
      {/* Animated Gradient Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, backgroundPosition: ["0% 50%", "100% 50%"] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
        className="absolute inset-0 z-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40 bg-[length:200%_200%] backdrop-blur-md"
      />

      {/* Centered Content */}
      <div className="relative z-10 max-w-[90vw] md:max-w-2xl mx-auto text-center space-y-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="uppercase text-sm md:text-base font-medium tracking-wide"
        >
          Train with purpose, transform with pride
        </motion.p>

        {/* Typewriter Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          aria-label="Prestige Gym"
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase tracking-tight 
                     bg-gradient-to-r from-blue-400 via-pink-400 to-purple-500 bg-clip-text text-transparent"
        >
          <ReactTyped
            strings={["Prestige Gym"]}
            typeSpeed={80}
            backSpeed={40}
            backDelay={1500}
            loop
            showCursor
            cursorChar="|"
          />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0em" }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="uppercase text-sm md:text-base font-medium tracking-wide"
        >
          "Strength. Discipline. Prestige."
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/signUp">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px #1F5C8E" }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1F5C8E] sm:bg-white text-white sm:text-[#1F5C8E] font-semibold px-8 py-3 rounded-md text-sm sm:text-base uppercase transition"
            >
              Join Now
            </motion.button>
          </Link>

          <Link href="/signup">
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#fff",
                color: "#1F5C8E",
              }}
              whileTap={{ scale: 0.95 }}
              className="border border-white sm:border-[#1F5C8E] text-white px-8 py-3 rounded-md text-sm sm:text-base uppercase transition"
            >
              Book a Tour
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
