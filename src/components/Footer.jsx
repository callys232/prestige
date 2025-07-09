"use client";

import React, { useState } from "react";

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    program: "",
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Replace with your actual form handling logic
  };

  return (
    <footer className="w-full px-6 py-12 text-gray-800 bg-white dark:text-gray-100">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 uppercase tracking-wide"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Franklin Nwadu"
            value={formData.name}
            onChange={handleChange("name")}
            className="w-full bg-transparent border-b border-gray-400 dark:border-gray-600 py-2 px-1 text-lg text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-0"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 uppercase tracking-wide"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+234 70 185 103"
            value={formData.phone}
            onChange={handleChange("phone")}
            className="w-full bg-transparent border-b border-gray-400 dark:border-gray-600 py-2 px-1 text-lg text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-0"
          />
        </div>

        {/* Program */}
        <div>
          <label
            htmlFor="program"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300 uppercase tracking-wide"
          >
            Program
          </label>
          <select
            id="program"
            value={formData.program}
            onChange={handleChange("program")}
            className="w-full bg-transparent border-b border-[#124943] dark:border-gray-600 py-2 px-1 text-lg text-[#7CC2BA] dark:text-white appearance-none focus:outline-none focus:ring-0
           [&>option]:text-[#000000] dark:[&>option]:text-blue"
          >
            <option value="">Select a program</option>
            <option value="Kids Program">Kids Program</option>
            <option value="Adult Program">Adult Program</option>
            <option value="Dance & Cardio">Dance & Cardio</option>
          </select>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="mt-4 px-8 py-3 bg-[#0652A6] text-white text-lg font-semibold rounded-md hover:bg-[#526591c5] transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </footer>
  );
};

export default Footer;
