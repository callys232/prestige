"use client";

import React, { useState } from "react";

const HeroSection = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-10 px-4 text-white"
      style={{ backgroundImage: "url('/Hero.png')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/30 to-black/5 backdrop-blur-md dark:from-black/40 dark:to-black/10" />

      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-white text-white hover:bg-white hover:text-[#1F5C8E] active:scale-90 transition duration-300"
          aria-label="Toggle dark mode"
        >
          {isDark ? "🌞" : "🌙"}
        </button>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 max-w-[90vw] md:max-w-md mx-auto text-center space-y-6">
        <p className="uppercase text-sm md:text-base font-medium tracking-wide">
          Train with purpose, transform with pride
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase tracking-tight whitespace-nowrap">
          Prestige Gym
        </h1>

        <div className="flex justify-center flex-wrap gap-4 font-semibold text-lg sm:text-xl md:text-2xl tracking-wider">
          <span>Strength</span>
          <span>Discipline</span>
          <span>Prestige</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <button
            className="bg-[#1F5C8E] sm:bg-white text-white sm:text-[#1F5C8E] font-semibold px-8 py-3 rounded-md text-sm sm:text-base uppercase 
            hover:bg-[#174a71] sm:hover:bg-gray-100 
            active:bg-[#174a71] sm:active:bg-gray-200 
            active:scale-95 active:shadow-inner 
            focus:bg-[#174a71] focus:outline-none 
            transition duration-200 ease-out"
          >
            Join Now
          </button>

          <button
            className="border border-white sm:border-[#1F5C8E] text-white sm:text-[#1F5C8E] px-8 py-3 rounded-md text-sm sm:text-base uppercase 
            hover:bg-white hover:text-[#1F5C8E] 
            active:bg-white active:text-[#1F5C8E] 
            active:scale-95 active:shadow-inner 
            focus:bg-white focus:text-[#1F5C8E] focus:outline-none 
            transition duration-200 ease-out"
          >
            Book a Tour
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
