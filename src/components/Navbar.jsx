"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/aboutUs" },
    { label: "Gallery", href: "/gallery" },
    { label: "Classes", href: "/classes" },
    { label: "Contact", href: "/contact" },
  ];

  const [isClicked, setIsClicked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b-2 border-blue-700 px-2 py-3 shadow-md">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo on the left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png" // replace with your logo in /public
              alt="Prestige Gym Logo"
              width={120}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation (center) */}
        <ul className="hidden md:flex flex-wrap gap-x-4 gap-y-2 text-[#0B56A3] font-medium text-sm uppercase">
          {navItems.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className={`relative inline-block px-2 py-1 transition duration-300 ease-in-out hover:text-white hover:bg-blue-950 hover:rounded-md hover:scale-105 ${
                  pathname === href ? "text-white bg-blue-950 rounded-md" : ""
                }`}
              >
                <span className="after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Login on the right */}
        <div className="hidden md:flex gap-2">
          <Link
            href="/login"
            onClick={handleClick}
            className={`border font-medium px-4 py-1.5 rounded-md text-sm transition duration-200 ${
              isClicked
                ? "bg-[#0B56A3] text-blue-100 border-[#0B56A3] scale-95"
                : "border-[#0652A6] text-[#0652A6] hover:bg-[#0B56A3] hover:text-blue-200"
            }`}
          >
            Login
          </Link>
          {/* <Link
            href="/signup"
            onClick={handleClick}
            className={`border font-medium px-4 py-1.5 rounded-md text-sm transition duration-200 ${
              isClicked
                ? "bg-[#0B56A3] text-blue-100 border-[#0B56A3] scale-95"
                : "border-[#0652A6] text-[#0652A6] hover:bg-[#0B56A3] hover:text-blue-200"
            }`}
          >
            Sign Up
          </Link> */}
        </div>

        {/* Mobile Hamburger (right) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#0652A6] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-6 h-6"
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
      </div>

      {/* Mobile Nav Links */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col items-start px-6 pb-4 gap-2 text-[#0B56A3] font-medium text-sm uppercase animate-slideDown">
          {navItems.map(({ label, href }) => (
            <li key={label} className="w-full">
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block w-full py-2 px-2 rounded transition ${
                  pathname === href
                    ? "bg-blue-950 text-white"
                    : "hover:bg-blue-950 hover:text-white"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}

          {/* Mobile Login*/}
          <div className="flex gap-2 mt-4">
            <Link
              href="/login"
              className="border border-[#0652A6] text-[#0652A6] px-4 py-1.5 rounded-md text-sm hover:bg-[#0B56A3] hover:text-blue-200"
            >
              Login
            </Link>
          </div>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
