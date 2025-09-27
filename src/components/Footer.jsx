"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-10 pb-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand / Mission */}
        <div>
          <h3 className="text-xl font-bold text-prestigeTeal mb-3">
            Prestige Gym
          </h3>
          <p className="text-sm leading-relaxed">
            Building strength, endurance, and community. Your fitness journey
            starts and grows here.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {/* Classes → violet */}
            <li>
              <Link
                href="/classes"
                className="
          relative inline-block
          transition-colors duration-200
          hover:text-violet-500 focus:text-violet-500
          after:absolute after:left-0 after:bottom-0
          after:h-[2px] after:w-full after:bg-violet-500
          after:origin-left after:scale-x-0
          after:transition-transform after:duration-300
          hover:after:scale-x-100 focus:after:scale-x-100
          focus:outline-none
        "
              >
                Classes
              </Link>
            </li>

            {/* Trainers → emerald */}
            <li>
              <Link
                href="/trainers"
                className="
          relative inline-block
          transition-colors duration-200
          hover:text-emerald-500 focus:text-emerald-500
          after:absolute after:left-0 after:bottom-0
          after:h-[2px] after:w-full after:bg-emerald-500
          after:origin-left after:scale-x-0
          after:transition-transform after:duration-300
          hover:after:scale-x-100 focus:after:scale-x-100
          focus:outline-none
        "
              >
                Our Trainers
              </Link>
            </li>

            {/* Membership → amber */}
            <li>
              <Link
                href="/membership"
                className="
          relative inline-block
          transition-colors duration-200
          hover:text-amber-500 focus:text-amber-500
          after:absolute after:left-0 after:bottom-0
          after:h-[2px] after:w-full after:bg-amber-500
          after:origin-left after:scale-x-0
          after:transition-transform after:duration-300
          hover:after:scale-x-100 focus:after:scale-x-100
          focus:outline-none
        "
              >
                Membership
              </Link>
            </li>

            {/* Contact → blue */}
            <li>
              <Link
                href="/contact"
                className="
          relative inline-block
          transition-colors duration-200
          hover:text-blue-500 focus:text-blue-500
          after:absolute after:left-0 after:bottom-0
          after:h-[2px] after:w-full after:bg-blue-500
          after:origin-left after:scale-x-0
          after:transition-transform after:duration-300
          hover:after:scale-x-100 focus:after:scale-x-100
          focus:outline-none
        "
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
