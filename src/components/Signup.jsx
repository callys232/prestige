"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SignupForm() {
  const searchParams = useSearchParams();
  const prefillClass = searchParams.get("className");
  const prefillTrainer = searchParams.get("trainer");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    goal: "",
    className: prefillClass || "",
    trainer: prefillTrainer || "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      className: prefillClass || prev.className,
      trainer: prefillTrainer || prev.trainer,
    }));
  }, [prefillClass, prefillTrainer]);

  const trainers = ["Coach Aisha", "Coach David", "Coach Emeka", "Coach Grace"];
  const goals = [
    "Build Muscle",
    "Lose Weight",
    "Improve Endurance",
    "Increase Flexibility",
    "General Fitness",
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data:", formData);
    // TODO: send to backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Join Prestige Gym
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 8 characters required
            </p>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Gender --</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Fitness Goal
            </label>
            <select
              name="goal"
              required
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Goal --</option>
              {goals.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Class (readonly if prefilled) */}
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              readOnly={!!prefillClass}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Trainer (dropdown if not prefilled) */}
          <div>
            <label className="block text-sm font-medium mb-1">Trainer</label>
            {prefillTrainer ? (
              <input
                type="text"
                name="trainer"
                value={formData.trainer}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
              />
            ) : (
              <select
                name="trainer"
                required
                value={formData.trainer}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose a Trainer --</option>
                {trainers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md font-semibold hover:bg-blue-800 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
