"use client";

import React, { useState } from "react";
import Link from "next/link";

const NavBar = () => {
  const navItems = ["About Us", "Gallery", "Classes", "Contact"];
  const [isClicked, setIsClicked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <nav className="w-full bg-white border-b-2 border-blue-700 px-2 py-3">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Login/Signup */}
        <div>
          <Link
            href="/Profile"
            onClick={handleClick}
            className={`inline-block border font-semibold px-6 py-2 rounded-md transition duration-200 ${
              isClicked
                ? "bg-[#0B56A3] text-blue-100 border-[#0B56A3] scale-95"
                : "border-[#0652A6] text-[#0652A6] hover:bg-[#0B56A3] hover:text-blue-200"
            }`}
          >
            Login / Signup
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#0652A6] focus:outline-none"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex flex-wrap gap-x-6 gap-y-2 text-[#0B56A3] font-bold text-xl uppercase">
          {navItems.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="relative inline-block px-2 py-1 transition duration-300 ease-in-out hover:text-white hover:bg-blue-950 hover:rounded-md hover:scale-105"
              >
                <span className="after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                  {item}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Nav Links */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col items-start px-6 pb-4 gap-3 text-[#0B56A3] font-bold text-lg uppercase">
          {navItems.map((item) => (
            <li key={item} className="w-full">
              <a
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMenuOpen(false)}
                className="block w-full py-2 px-2 rounded hover:bg-blue-950 hover:text-white transition"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
