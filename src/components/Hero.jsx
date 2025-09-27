"use client";

import React, { useState } from "react";
import Link from "next/link";

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

      {/* Centered Content */}
      <div className="relative z-10 max-w-[90vw] md:max-w-md mx-auto text-center space-y-4">
        <p
          className="uppercase text-sm md:text-base font-medium tracking-wide 
             opacity-0 animate-fadeInUp [animation-delay:200ms] [animation-fill-mode:forwards]"
        >
          Train with purpose, transform with pride
        </p>

        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase tracking-tight whitespace-nowrap 
             opacity-0 animate-fadeInUp [animation-delay:500ms] [animation-fill-mode:forwards]"
        >
          Prestige Gym
        </h1>

        <div className="flex justify-center flex-wrap gap-4 font-semibold text-lg sm:text-xl md:text-2xl tracking-wider">
          <span className="opacity-0 animate-fadeInUp [animation-delay:800ms] [animation-fill-mode:forwards]">
            Strength
          </span>
          <span className="opacity-0 animate-fadeInUp [animation-delay:1000ms] [animation-fill-mode:forwards]">
            Discipline
          </span>
          <span className="opacity-0 animate-fadeInUp [animation-delay:1200ms] [animation-fill-mode:forwards]">
            Prestige
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <Link href="/signUp">
            <button
              className="bg-[#1F5C8E] sm:bg-white text-white sm:text-[#1F5C8E] font-semibold px-6 py-3 rounded-md text-sm sm:text-base uppercase 
               hover:bg-[#174a71] sm:hover:bg-gray-100 
               active:bg-[#174a71] sm:active:bg-gray-200 
               active:scale-95 active:shadow-inner 
               focus:bg-[#174a71] focus:outline-none 
               transition duration-200 ease-out"
            >
              Join Now
            </button>
          </Link>

          <Link href="/signup">
            <button
              className="border border-white sm:border-[#1F5C8E] text-white px-8 py-3 rounded-md text-sm sm:text-base uppercase 
  animate-fadeUp
  hover:bg-white hover:text-[#1F5C8E] hover:animate-pulse
  active:bg-white active:text-white active:scale-95 active:shadow-inner
  focus:bg-white focus:text-[#1F5C8E] focus:outline-none
  transition duration-200 ease-out"
            >
              Book a Tour
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
