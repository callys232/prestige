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
      className="relative bg-cover bg-center bg-no-repeat py-8 px-4 text-white"
      style={{ backgroundImage: "url('/Hero.png')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/30 to-black/5 backdrop-blur-md dark:from-black/40 dark:to-black/10" />

      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-white text-white hover:bg-white hover:text-[#1F5C8E] transition duration-300"
          aria-label="Toggle dark mode"
        >
          {isDark ? "🌞" : "🌙"}
        </button>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 mx-auto max-w-md text-center space-y-6">
        <p className="uppercase text-sm md:text-base font-medium tracking-wide">
          Train with purpose, transform with pride
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight whitespace-nowrap">
          Prestige Gym
        </h1>

        <div className="flex justify-center gap-6 font-semibold text-lg md:text-2xl tracking-wider">
          <span>Strength</span>
          <span>Discipline</span>
          <span>Prestige</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center pt-2">
          <button className="bg-white text-[#1F5C8E] font-semibold px-8 py-3 rounded-md text-sm md:text-base uppercase hover:bg-gray-100 transition">
            Join Now
          </button>
          <button className="border border-white px-8 py-3 rounded-md text-sm md:text-base uppercase hover:bg-white hover:text-[#1F5C8E] transition">
            Book a Tour
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
