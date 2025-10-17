"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const words = [
    { text: "Building strength", color: "text-blue-400" },
    { text: "endurance", color: "text-yellow-400" },
    { text: "and community", color: "text-green-400" },
    {
      text: "Your fitness journey starts and grows here.",
      color: "text-prestigeTeal",
    },
  ];

  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState("typing"); // "typing" | "pausing"

  // Typewriter effect logic
  useEffect(() => {
    let timeout;

    if (phase === "typing") {
      if (charIndex < words[index].text.length) {
        timeout = setTimeout(() => {
          setDisplayed((prev) => prev + words[index].text[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 70);
      } else {
        // Finished typing, switch to pause
        setPhase("pausing");
      }
    } else if (phase === "pausing") {
      // Keep full text for 1.5s, then reset
      timeout = setTimeout(() => {
        setDisplayed("");
        setCharIndex(0);
        setIndex((prev) => (prev + 1) % words.length);
        setPhase("typing");
      }, 1500);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, index, phase]);

  return (
    <footer className="bg-gray-900 text-gray-200 pt-10 pb-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand / Mission */}
        <div>
          <h3 className="text-xl font-bold text-prestigeTeal mb-3">
            Prestige Gym
          </h3>
          <p className="text-sm leading-relaxed" aria-live="polite">
            <span className={`${words[index].color} font-medium`}>
              {displayed}
            </span>
            <span className="animate-pulse text-prestigeTeal">|</span>
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/classes"
                className="relative inline-block transition-colors duration-200 hover:text-violet-500 focus:text-violet-500 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-violet-500 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 focus:after:scale-x-100 focus:outline-none"
              >
                Classes
              </Link>
            </li>
            <li>
              <Link
                href="/classes"
                className="relative inline-block transition-colors duration-200 hover:text-emerald-500 focus:text-emerald-500 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-emerald-500 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 focus:after:scale-x-100 focus:outline-none"
              >
                Our Trainers
              </Link>
            </li>
            <li>
              <Link
                href="/membership"
                className="relative inline-block transition-colors duration-200 hover:text-amber-500 focus:text-amber-500 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-amber-500 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 focus:after:scale-x-100 focus:outline-none"
              >
                Membership
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="relative inline-block transition-colors duration-200 hover:text-blue-500 focus:text-blue-500 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-500 after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 focus:after:scale-x-100 focus:outline-none"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Opening Hours</h4>
          <ul className="text-sm space-y-1">
            <li>Mon – Fri: 5:30am – 10:00pm</li>
            <li>Saturday: 7:00am – 8:00pm</li>
            <li>Sunday: 8:00am – 6:00pm</li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Get in Touch</h4>
          <p className="text-sm">📍 123 Fitness Ave, Abuja</p>
          <p className="text-sm">📞 +234 800 123 4567</p>
          <p className="text-sm">✉️ info@prestigegym.com</p>
          <div className="flex gap-4 mt-3">
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-prestigeTeal"
            >
              📸
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-prestigeTeal"
            >
              👍
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-prestigeTeal"
            >
              🐦
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Prestige Gym. All rights reserved.</p>
        <p className="mt-1 italic text-prestigeTeal">“Stronger Every Day.”</p>
      </div>
    </footer>
  );
}
