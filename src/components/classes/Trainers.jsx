"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const trainers = [
  {
    id: 1,
    name: "Coach Aisha",
    image: "/trainer-aisha.png",
    classes: ["HIIT", "Strength Training"],
    diet: "High-protein, balanced carbs",
    color: "group-hover:bg-blue-100",
  },
  {
    id: 2,
    name: "Coach David",
    image: "/trainer-david.jpg",
    classes: ["Yoga", "Flexibility"],
    diet: "Plant-based, light meals",
    color: "group-hover:bg-green-100",
  },
  {
    id: 3,
    name: "Coach Emeka",
    image: "/trainer-emeka.jpg",
    classes: ["Boxing", "Cardio"],
    diet: "Lean protein, low fat",
    color: "group-hover:bg-red-100",
  },
  {
    id: 4,
    name: "Coach Grace",
    image: "/trainer-grace.jpg",
    classes: ["Pilates", "Core Strength"],
    diet: "Mediterranean style",
    color: "group-hover:bg-purple-100",
  },
];

export default function TrainersSection() {
  const [selected, setSelected] = useState({});
  // { trainerId: className }

  const handleClassSelect = (trainerId, className) => {
    setSelected((prev) => ({ ...prev, [trainerId]: className }));
  };

  return (
    <section className="py-12 px-6 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center text-[#1F5C8E] mb-10">
        Meet Our Trainers
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {trainers.map((trainer) => {
          const chosenClass = selected[trainer.id] || "";
          return (
            <div
              key={trainer.id}
              className={`group relative border border-[#1F5C8E] rounded-lg overflow-hidden shadow-md transition duration-300`}
            >
              {/* Trainer Image */}
              <Image
                src={trainer.image}
                alt={trainer.name}
                width={400}
                height={300}
                className="object-cover w-full h-64"
              />

              {/* Hidden Content - shows on hover */}
              <div
                className={`absolute inset-0 flex flex-col justify-center items-center text-center p-6 bg-white/90 dark:bg-gray-800/90 opacity-0 group-hover:opacity-100 transition duration-300 ${trainer.color}`}
              >
                <h3 className="text-xl font-semibold text-[#1F5C8E] mb-2">
                  {trainer.name}
                </h3>

                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Classes:
                </p>
                <select
                  value={chosenClass}
                  onChange={(e) =>
                    handleClassSelect(trainer.id, e.target.value)
                  }
                  className="w-full mb-3 px-3 py-2 border rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Select a Class --</option>
                  {trainer.classes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>

                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dietary Plan:
                </p>
                <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
                  {trainer.diet}
                </p>

                {/* Show Join Now only if a class is chosen */}
                {/* {chosenClass && (
                  <Link
                    href={{
                      pathname: "/signup",
                      query: { trainer: trainer.name, className: chosenClass },
                    }}
                    className="inline-block mt-2 px-4 py-2 bg-[#1F5C8E] text-white rounded hover:bg-blue-800 transition"
                  >
                    Join Now
                  </Link>
                )} */}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
