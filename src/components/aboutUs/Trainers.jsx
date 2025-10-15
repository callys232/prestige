"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const trainers = [
  {
    name: "Coach Amina",
    image: "/trainer1.jpg",
    history: "10+ years in strength training and holistic wellness.",
    skills: ["Powerlifting", "Mobility", "Nutrition"],
  },
  {
    name: "Coach Tunde",
    image: "/trainer2.jpg",
    history: "Former athlete turned mindset mentor and performance coach.",
    skills: ["HIIT", "Endurance", "Mental Conditioning"],
  },
  {
    name: "Coach Zara",
    image: "/trainer3.jpg",
    history: "Specialist in group dynamics and transformation programs.",
    skills: ["Group Training", "Bodyweight", "Motivation"],
  },
];

const Trainers = () => {
  return (
    <section className="relative py-16 px-4 text-[#0B56A3] dark:text-white overflow-hidden">
      {/* Frosted Blue Background Layer */}
      <div className="absolute inset-0 bg-blue-700/40 dark:bg-blue-950/40 backdrop-blur-xl z-0"></div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 bg-[length:200%_200%] bg-clip-text text-transparent"
        >
          Meet Our Trainers
        </motion.h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {trainers.map(({ name, image, history, skills }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/30 dark:bg-blue-950/20 backdrop-blur-md border border-white/10 ring-1 ring-white/10 rounded-xl shadow-md p-6 text-center transform transition duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl"
            >
              <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full border-4 border-[#0B56A3] shadow-lg">
                <Image
                  src={image}
                  alt={name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{name}</h3>
              <p className="text-sm text-white/80 dark:text-white/70 mb-4">
                {history}
              </p>

              {/* Skill badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs rounded-full bg-[#0B56A3]/20 text-[#0B56A3] dark:bg-blue-800/40 dark:text-blue-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <Link
                href="/classes"
                className="inline-block mt-2 px-5 py-2 bg-gradient-to-r from-[#0B56A3] to-blue-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                Book Now
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;
