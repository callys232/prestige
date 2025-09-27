"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const classes = [
  {
    id: 1,
    name: "Unbreakable Strength",
    image: "/class-strength.jpg",
    description:
      "Master powerlifting and resistance training. Build raw strength and push past your limits.",
    level: "Intermediate – Advanced",
    trainers: ["Coach Aisha", "Coach Emeka"],
  },
  {
    id: 2,
    name: "Limitless HIIT",
    image: "/class-hiit.jpg",
    description:
      "High-intensity intervals to burn fat, boost endurance, and leave you feeling unstoppable.",
    level: "All Levels",
    trainers: ["Coach David", "Coach Aisha"],
  },
  {
    id: 3,
    name: "Restore & Rise",
    image: "/class-recovery.jpg",
    description:
      "Mobility and recovery flows to realign your body and mind. Stretch, breathe, and rebuild.",
    level: "Beginner – Intermediate",
    trainers: ["Coach Grace", "Coach David"],
  },
  {
    id: 4,
    name: "KidFit PlayZone",
    image: "/class-kids.jpg",
    description:
      "Fun, safe, and energetic workouts for kids. Builds coordination, confidence, and healthy habits.",
    level: "Ages 5–12",
    trainers: ["Coach Grace"],
  },
  {
    id: 5,
    name: "Cardio Core Blast",
    image: "/class-cardio.jpg",
    description:
      "Heart-pumping cardio fused with core conditioning. Burn calories and sculpt your midsection.",
    level: "All Levels",
    trainers: ["Coach Emeka", "Coach David"],
  },
  {
    id: 6,
    name: "Adult Functional Training",
    image: "/class-adult.jpg",
    description:
      "Train for real life. Improve balance, strength, and mobility with functional movement patterns.",
    level: "Adults 40+",
    trainers: ["Coach Aisha", "Coach Grace"],
  },
];

const Classes = () => {
  const [selectedTrainer, setSelectedTrainer] = useState({});
  // { classId: trainerName }

  const handleTrainerSelect = (classId, trainer) => {
    setSelectedTrainer((prev) => ({ ...prev, [classId]: trainer }));
  };

  return (
    <section className="relative py-16 px-4 text-[#0B56A3] dark:text-white overflow-hidden">
      {/* Frosted Blue Background */}
      <div className="absolute inset-0 bg-blue-700/40 dark:bg-blue-950/40 backdrop-blur-xl z-0"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Our Signature Classes
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {classes.map(({ id, name, image, description, level, trainers }) => (
            <div
              key={id}
              className="bg-white/30 dark:bg-blue-950/20 backdrop-blur-md border border-white/10 ring-1 ring-white/10 rounded-xl shadow-md p-6 text-center transform transition duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
            >
              <div className="w-full h-40 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt={name}
                  width={400}
                  height={160}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{name}</h3>
              <p className="text-sm text-white/80 dark:text-white/70 mb-3">
                {description}
              </p>
              <p className="text-xs italic text-blue-200 dark:text-blue-300 mb-4">
                {level}
              </p>

              {/* Trainer Dropdown */}
              <select
                value={selectedTrainer[id] || ""}
                onChange={(e) => handleTrainerSelect(id, e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
              >
                <option value="">-- Select Trainer --</option>
                {trainers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Show Join Now only when trainer is selected */}
              {selectedTrainer[id] && (
                <Link
                  href={{
                    pathname: "/signup",
                    query: { className: name, trainer: selectedTrainer[id] },
                  }}
                  className="inline-block mt-2 px-4 py-2 bg-[#0B56A3] text-white rounded hover:bg-blue-800 transition"
                >
                  Join Now
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Classes;
