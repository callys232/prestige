"use client";

import React, { useState } from "react";

const IntakeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    program: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError("");
  };

  const validatePhone = (phone) => /^(?:\+234|0)[789][01]\d{8}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, program } = formData;

    if (!name || !phone || !program) {
      setError("Please fill out all fields.");
      setSuccess(false);
      return;
    }

    if (!validatePhone(phone)) {
      setError("Please enter a valid Nigerian phone number.");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, program }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", phone: "", program: "" });
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(data.error || "Failed to send the form. Try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-6 py-12 text-red-800 bg-white dark:text-gray-100 relative overflow-hidden">
      {/* Success Popup */}
      {success && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-slide-up bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
          ✅ Your form has been submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        {error && (
          <div className="text-red-600 dark:text-red-400 font-medium">
            ⚠️ {error}
          </div>
        )}

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
            className="w-full bg-transparent border-b border-gray-400 dark:border-gray-600 py-2 px-1 text-lg text-[#1F5C8E] dark:text-[#1F5C8E] placeholder:text-gray-400 placeholder:opacity-50 focus:placeholder-transparent focus:outline-none focus:ring-0"
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
            placeholder="+234 701 851 03XX"
            value={formData.phone}
            onChange={handleChange("phone")}
            className="w-full bg-transparent border-b border-gray-400 dark:border-gray-600 py-2 px-1 text-lg text-[#1F5C8E] dark:text-[#1F5C8E] placeholder:text-gray-400 placeholder:opacity-50 focus:placeholder-transparent focus:outline-none focus:ring-0"
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
            className="w-full bg-transparent border-b border-[#1F5C8E] dark:border-gray-600 py-2 px-1 text-lg text-[#1F5C8E] dark:text-[#1F5C8E] appearance-none focus:outline-none focus:ring-0"
          >
            <option value="">Select a program</option>
            <option value="Kids Program">Kids Program</option>
            <option value="Adult Program">Adult Program</option>
            <option value="Dance & Cardio">Dance & Cardio</option>
          </select>

          {formData.program && (
            <p className="mt-2 text-sm text-[#1F5C8E]">
              Selected: <strong>{formData.program}</strong>
            </p>
          )}
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 px-8 py-3 text-lg font-semibold rounded-md transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0652A6] text-white hover:bg-[#526591c5]"
            }`}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes slide-up {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default IntakeForm;
