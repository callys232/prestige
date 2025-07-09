"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// Individual dropdown component
const ProgramDropdown = ({ label, links }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="px-6 py-2 bg-[#1F5C8E] text-white rounded-xl font-semibold uppercase tracking-wide shadow-md hover:brightness-110 transition"
      >
        {label}
      </button>

      {isOpen && (
        <ul className="absolute left-0 top-full mt-2 bg-white text-blue-800 font-medium rounded-xl shadow-lg min-w-[180px] z-10">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-5 py-2 hover:bg-[#1F5C8E] hover:text-white transition"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main section
const Programs = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat text-black dark:text-white py-20 px-6"
      style={{ backgroundImage: "url('/bodybg.png')" }}
    >
      {/* Gradient + Blur Overlay */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-0" />

      {/* Intro Text */}
      <div className="relative z-10 max-w-4xl mx-auto text-left space-y-4 mb-16">
        <p className="text-lg md:text-xl font-medium text-white dark:text-gray-200">
          From kids&apos; fitness to adult training, dance to dumbbells, we
          combine expert coaching with modern equipment to ensure every member
          trains smart, stays motivated, and feels empowered.
        </p>
        <div className="text-left">
          <Link
            href="/about"
            className="inline-block mt-4 px-6 py-3 border border-[#1F5C8E] rounded hover:bg-white hover:text-[#1F5C8E] dark:hover:bg-white dark:hover:text-black transition"
          >
            Read More
          </Link>
        </div>
      </div>

      <div className="h-10 w-10 bg-prestigeTeal" />

      {/* Adults Program Section */}
      <div className="relative z-10 w-full bg-white dark:bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          {/* Text Content */}
          <div className="flex-1 space-y-4">
            <h2 className="inline-block px-8 py-3 bg-[#1F5C8E] text-white text-3xl font-bold uppercase tracking-wide rounded-xl shadow-md hover:shadow-xl hover:brightness-110 transition duration-300">
              ADULTS PROGRAM
            </h2>

            <p className="text-gray-800 dark:text-gray-300">
              Our adult programs are designed to help you build strength,
              improve endurance, and stay active no matter your fitness level.
              With flexible workout plans, expert guidance, and a motivating
              community, you’ll find the perfect routine to match your goals.
              Whether you&apos;re into weight training, cardio, or group classes
              — Prestige Gym is where progress meets consistency.
            </p>

            {/* Program Buttons */}
            <div className="flex flex-wrap gap-4 mt-4">
              <ProgramDropdown
                label="Adults Program"
                links={[
                  { label: "Overview", href: "/programs/adults/overview" },
                  { label: "Schedule", href: "/programs/adults/schedule" },
                  { label: "Pricing", href: "/programs/adults/pricing" },
                ]}
              />
              <ProgramDropdown
                label="Kids Fitness"
                links={[
                  { label: "Classes", href: "/programs/kids/classes" },
                  { label: "Trainers", href: "/programs/kids/trainers" },
                ]}
              />
              <ProgramDropdown
                label="Dance & Cardio"
                links={[
                  { label: "Schedule", href: "/programs/dance/schedule" },
                  { label: "Styles", href: "/programs/dance/styles" },
                ]}
              />
            </div>
          </div>

          {/* Image */}
          <div className="flex-1">
            <Image
              src="/images/adult-program.jpg"
              alt="Adults Program"
              width={600}
              height={400}
              className="w-full h-auto rounded shadow-md object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
