"use client";

import React from "react";
import Link from "next/link";

const AboutUs = () => {
  return (
    <section className="bg-white dark:bg-gray-900 text-[#0B56A3] dark:text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Who We Are</h1>
        <p className="text-lg md:text-xl leading-relaxed mb-8">
          Prestige was born from a simple idea: that strength is not just physical — it's a mindset. What started as a small community of driven individuals has grown into a movement that empowers people to push limits, break barriers, and become unstoppable.
        </p>
        <p className="text-base md:text-lg leading-relaxed mb-8">
          From our first workshop to our latest class, our mission has remained the same: to build a space where passion meets purpose, and where every rep, every step, and every story matters.
        </p>
        <Link
          href="/gallery"
          className="inline-block px-6 py-2 bg-[#0B56A3] text-white rounded hover:bg-blue-800 transition"
        >
          See Our Journey
        </Link>
      </div>
    </section>
  );
};

export default AboutUs;
