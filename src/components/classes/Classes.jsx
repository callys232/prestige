"use client";

import React, { useState } from "react";
import ClassCard from "./classCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Category data with theme colors and 3 classes each
const classCategories = [
  {
    category: "Dance Fitness",
    theme: {
      text: "text-pink-600 dark:text-pink-300",
      base: "border-pink-300 bg-pink-500/5",
      hover:
        "hover:border-pink-500 hover:shadow-pink-500/40 hover:bg-pink-500/10",
      active: "active:border-pink-600 active:bg-pink-500/20",
    },
    classes: [
      {
        id: 1,
        name: "Dance Fitness Class",
        image: "/class-dance.jpg",
        description:
          "High-energy dance routines to boost cardio endurance, rhythm, and toning.",
        level: "All Levels",
        trainers: ["Coach Aisha", "Coach David"],
        icon: "💃",
        workout: [
          "Warm-Up",
          "Latin Groove",
          "Hip-Hop Cardio",
          "Afrobeat Flow",
          "Strength & Tone",
          "Cool-Down",
        ],
      },
      {
        id: 2,
        name: "Zumba Fusion",
        image: "/class-zumba.jpg",
        description: "Latin-inspired cardio dance party with fun choreography.",
        level: "Beginner – Intermediate",
        trainers: ["Coach Grace"],
        icon: "🎶",
        workout: [
          "Warm-Up",
          "Zumba Block 1",
          "Zumba Block 2",
          "Strength Moves",
          "Cool-Down",
        ],
      },
      {
        id: 3,
        name: "Afro Dance Burn",
        image: "/class-afro.jpg",
        description: "Afrobeat-inspired dance cardio to sweat and groove.",
        level: "All Levels",
        trainers: ["Coach Emeka"],
        icon: "🔥",
        workout: [
          "Warm-Up",
          "Afrobeat Flow",
          "Dance Drills",
          "Strength Finish",
          "Cool-Down",
        ],
      },
    ],
  },
  {
    category: "Kids Fitness",
    theme: {
      text: "text-yellow-600 dark:text-yellow-300",
      base: "border-yellow-300 bg-yellow-500/5",
      hover:
        "hover:border-yellow-500 hover:shadow-yellow-500/40 hover:bg-yellow-500/10",
      active: "active:border-yellow-600 active:bg-yellow-500/20",
    },
    classes: [
      {
        id: 4,
        name: "Kids Fitness",
        image: "/class-kids.jpg",
        description: "Fun, safe, and energetic workouts for kids.",
        level: "Ages 5–12",
        trainers: ["Coach Grace"],
        icon: "🧒",
        workout: [
          "Warm-Up Game",
          "Circuit Stations",
          "Fun Challenge",
          "Cool-Down",
        ],
      },
      {
        id: 5,
        name: "Junior Bootcamp",
        image: "/class-junior.jpg",
        description:
          "Obstacle courses and games to build strength and agility.",
        level: "Ages 8–12",
        trainers: ["Coach David"],
        icon: "🏃",
        workout: ["Warm-Up", "Agility Drills", "Obstacle Course", "Cool-Down"],
      },
      {
        id: 6,
        name: "Mini Movers",
        image: "/class-mini.jpg",
        description: "Creative movement and play for younger kids.",
        level: "Ages 4–7",
        trainers: ["Coach Aisha"],
        icon: "🎈",
        workout: ["Warm-Up", "Dance Play", "Balance Games", "Stretch"],
      },
    ],
  },
  {
    category: "Cardio Blast",
    theme: {
      text: "text-red-600 dark:text-red-300",
      base: "border-red-300 bg-red-500/5",
      hover: "hover:border-red-500 hover:shadow-red-500/40 hover:bg-red-500/10",
      active: "active:border-red-600 active:bg-red-500/20",
    },
    classes: [
      {
        id: 7,
        name: "Cardio Blast",
        image: "/class-cardio.jpg",
        description: "Heart-pumping cardio fused with core conditioning.",
        level: "All Levels",
        trainers: ["Coach Emeka", "Coach David"],
        icon: "❤️",
        workout: ["Warm-Up", "HIIT Rounds", "Core Finisher", "Cool-Down"],
      },
      {
        id: 8,
        name: "HIIT Express",
        image: "/class-hiit.jpg",
        description: "Quick, intense HIIT session for max calorie burn.",
        level: "Intermediate",
        trainers: ["Coach Aisha"],
        icon: "⚡",
        workout: ["Warm-Up", "HIIT Circuits", "Core Burn", "Cool-Down"],
      },
      {
        id: 9,
        name: "Endurance Builder",
        image: "/class-endurance.jpg",
        description: "Longer cardio intervals to build stamina.",
        level: "Intermediate – Advanced",
        trainers: ["Coach Grace"],
        icon: "🔥",
        workout: ["Warm-Up", "Interval Runs", "Strength Finish", "Cool-Down"],
      },
      {
        id: 10,
        name: "Muscle Maranthon",
        image: "/class-endurance.jpg",
        description: "Longer cardio intervals to build stamina.",
        level: "Intermediate – Advanced",
        trainers: ["Coach Grace"],
        icon: "🔥",
        workout: ["Warm-Up", "Interval Runs", "Strength Finish", "Cool-Down"],
      },
      {
        id: 11,
        name: "press to Burn",
        image: "/class-endurance.jpg",
        description: "Longer cardio intervals to build stamina.",
        level: "Intermediate – Advanced",
        trainers: ["Coach Grace"],
        icon: "🔥",
        workout: ["Warm-Up", "Interval Runs", "Strength Finish", "Cool-Down"],
      },
    ],
  },
];

const Classes = () => {
  const [selectedTrainer, setSelectedTrainer] = useState({});

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
          Pick a Class that works for you
        </h2>

        {classCategories.map(({ category, classes, theme }) => (
          <div key={category} className="mb-16">
            <h3
              className={`text-2xl font-semibold text-center mb-6 ${theme.text}`}
            >
              {category}
            </h3>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-12"
            >
              {classes.map((cls) => (
                <SwiperSlide key={cls.id}>
                  <div
                    className={`
                      m-4 
                      rounded-xl border border-transparent 
                      transition-all duration-300 
                      ${theme.base} 
                      ${theme.hover} 
                      ${theme.active}
                    `}
                  >
                    <ClassCard
                      {...cls}
                      theme={theme}
                      selectedTrainer={selectedTrainer}
                      onTrainerSelect={handleTrainerSelect}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Classes;
