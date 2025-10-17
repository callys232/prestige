"use client";

import React, { useState } from "react";
import Link from "next/link";

const Contact = () => {
  const [messageSent, setMessageSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/contactus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setMessageSent(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setMessageSent(false), 4000);
      } else {
        setErrors({ form: data.error || "Failed to send message." });
      }
    } catch (err) {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 text-[#0B56A3] dark:text-white bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Get in Touch</h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Info Section */}
          <div className="bg-blue-50 dark:bg-blue-950 rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Prestige Gym, 123 Strength Lane, Abuja, Nigeria
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Mon–Sat: 6am – 9pm
              <br />
              Sunday: 8am – 6pm
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Call or Email</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              📞 +234 800 123 4567
              <br />
              📧 contact@prestigegym.com
            </p>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-blue-50 dark:bg-blue-950 rounded-xl shadow-md p-6 space-y-4"
          >
            <h3 className="text-xl font-semibold mb-2">Send Us a Message</h3>

            {errors.form && (
              <p className="text-red-500 text-sm mb-2">{errors.form}</p>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                className={`w-full px-4 py-2 rounded bg-white dark:bg-gray-800 text-[#0B56A3] dark:text-white transition-all duration-200 hover:ring-2 hover:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border border-red-500" : ""
                }`}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className={`w-full px-4 py-2 rounded bg-white dark:bg-gray-800 text-[#0B56A3] dark:text-white transition-all duration-200 hover:ring-2 hover:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border border-red-500" : ""
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 rounded bg-white dark:bg-gray-800 text-[#0B56A3] dark:text-white transition-all duration-200 hover:ring-2 hover:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.message ? "border border-red-500" : ""
                }`}
                placeholder="Tell us how we can help..."
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0B56A3] text-white hover:bg-blue-800"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {messageSent && (
              <p className="text-green-600 dark:text-green-400 text-sm mt-4 text-center">
                ✅ Your message has been sent. We'll get back to you soon!
              </p>
            )}
          </form>
        </div>

        <div className="text-center">
          <Link
            href="/classes"
            className="inline-block px-6 py-2 bg-[#0B56A3] text-white rounded hover:bg-blue-800 transition"
          >
            Explore Our Classes
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Contact;
