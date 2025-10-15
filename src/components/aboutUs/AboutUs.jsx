"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <section className="relative bg-white dark:bg-gray-900 text-[#0B56A3] dark:text-white py-20 px-4 overflow-hidden">
      {/* Decorative background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-transparent dark:from-gray-800 dark:via-gray-900 dark:to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          animate={{
            color: ["#0B56A3", "#1E90FF", "#FF4081", "#0B56A3"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-10"
        >
          WHO WE ARE
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-20 h-1 bg-[#0B56A3] dark:bg-white mx-auto mb-8 rounded origin-left"
        />

        {/* Content */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl leading-relaxed mb-6"
        >
          Prestige was born from a simple idea: that strength is not just
          physical — it's a mindset. What started as a small community of driven
          individuals has grown into a movement that empowers people to push
          limits, break barriers, and become unstoppable.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-base md:text-lg leading-relaxed mb-8"
        >
          From our first workshop to our latest class, our mission has remained
          the same: to build a space where passion meets purpose, and where
          every rep, every step, and every story matters.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <Link
            href="/gallery"
            className="inline-block px-8 py-3 bg-[#0B56A3] text-white rounded-full font-semibold shadow-md hover:shadow-lg hover:bg-blue-800 transition-transform transform hover:scale-105 animate-pulse"
          >
            See Our Journey
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
