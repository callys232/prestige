"use client";

import React from "react";
import { motion } from "framer-motion";

const GymTourSlide = () => {
  return (
    <section className="px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        animate={{
          color: ["#0B56A3", "#369b9bff", "#40ff83ff", "#ab265bff"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-center mb-10"
      >
        Explore Prestige Gym
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Gym Promo Video */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full aspect-video rounded-lg overflow-hidden shadow-lg"
        >
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/pREAnsX0GcM"
            title="Prestige Gym Promo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full aspect-video rounded-lg overflow-hidden shadow-lg"
        >
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.726... (replace with your gym’s embed link)"
            title="Prestige Gym Location"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default GymTourSlide;
