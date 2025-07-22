"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

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
        <h2 className="text-3xl font-bold text-center mb-10">Meet Our Trainers</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {trainers.map(({ name, image, history, skills }, i) => (
            <div
              key={i}
className="bg-white/30 dark:bg-blue-950/20 backdrop-blur-md border border-white/10 ring-1 ring-white/10 rounded-xl shadow-md p-6 text-center transform transition duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
            >
              <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full border-4 border-[#0B56A3]">
                <Image
                  src={image}
                  alt={name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{name}</h3>
              <p className="text-sm text-white/80 dark:text-white/70 mb-4">{history}</p>
              <div className="text-sm mb-4">
                <span className="font-semibold">Skills:</span>{" "}
                <span className="text-blue-200 dark:text-blue-300">{skills.join(", ")}</span>
              </div>
              <Link
                href="/classes"
                className="inline-block mt-2 px-4 py-2 bg-[#0B56A3] text-white rounded hover:bg-blue-800 transition"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;
