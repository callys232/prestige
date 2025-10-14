"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
// import Gallery from "@/components/Gallery";
import { useState } from "react";

export default function TourPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    trainer: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tour booking:", formData);
    // TODO: send to backend
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="relative bg-[url('/Hero.png')] bg-cover bg-center py-20 text-center text-white">
        <div className="bg-black/60 absolute inset-0" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase">
            Schedule a Prestige Tour
          </h1>
          <p className="mt-4 text-lg">
            See our facilities, meet our trainers, and feel the energy before
            you join.
          </p>
          <a href="#tour-form">
            <button className="mt-6 bg-blue-700 px-6 py-3 rounded-md font-semibold hover:bg-blue-800 transition">
              Schedule Your Tour
            </button>
          </a>
        </motion.div>
      </section>

      {/* Why Tour */}
      <section className="py-16 px-6 grid md:grid-cols-4 gap-6 text-center">
        {[
          { title: "Elite Equipment", desc: "Train with the best machines." },
          {
            title: "Expert Trainers",
            desc: "Guidance from certified coaches.",
          },
          { title: "Community Vibe", desc: "Be part of something bigger." },
          { title: "Flexible Plans", desc: "Memberships that fit your life." },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md cursor-pointer 
                 hover:shadow-xl transition duration-300"
          >
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Gallery
      <Gallery /> */}

      {/* Booking Form */}
      <section id="tour-form" className="py-16 px-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">
          Schedule Your Tour
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="trainer"
            placeholder="Preferred Trainer (optional)"
            value={formData.trainer}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md font-semibold hover:bg-blue-800 transition"
          >
            Book My Tour
          </button>
        </form>
      </section>

      {/* Closing CTA */}
      <section className="bg-blue-700 text-white py-12 text-center">
        <h2 className="text-2xl font-bold">Ready to transform?</h2>
        <p className="mt-2">
          Book your Prestige Gym tour today and take the first step.
        </p>
        <a href="#tour-form">
          <button className="mt-4 bg-white text-blue-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
            Schedule Now
          </button>
        </a>
      </section>
    </div>
  );
}
