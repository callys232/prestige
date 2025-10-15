"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupForm() {
  const searchParams = useSearchParams();
  const prefillClass = searchParams.get("className") || "";
  const prefillTrainer = searchParams.get("trainer") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    goal: "",
    className: "",
    health: "",
    trainer: prefillTrainer || "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
  const classes = [
    "Dance Fitness",
    "Zumba Fusion",
    "Kids Fitness",
    "Mini Movers",
    "Muscle Marathon",
    "Cardio Blast",
    "Press-to-Burn",
    "HiiT Express",
    "Endurance Builder",
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.gender) newErrors.gender = "Please select a gender";
    if (!formData.goal) newErrors.goal = "Please select a goal";
    if (!formData.trainer) newErrors.trainer = "Please select a trainer";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const message = json?.message || "Signup failed";
        // If backend returns field errors object, merge them
        if (json?.errors && typeof json.errors === "object") {
          setErrors((prev) => ({ ...prev, ...json.errors }));
        } else {
          setServerError(message);
        }
        return;
      }

      // success -> redirect to login with a query flag
      window.location.href = "/login?registered=1";
    } catch (err) {
      setServerError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Join Prestige Gym
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Server error */}
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-xs text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-white text-gray-800 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Gender --</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender}</p>
            )}
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Fitness Goal
            </label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-white text-gray-800 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Goal --</option>
              {goals.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.goal && (
              <p className="text-xs text-red-500">{errors.goal}</p>
            )}
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-white text-gray-800 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Class --</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Health Recommendations */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Health Recommendations
            </label>
            <textarea
              name="health"
              value={formData.health}
              onChange={handleChange}
              placeholder="Any health notes or recommendations"
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Trainer */}
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
                value={formData.trainer}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-white text-gray-800 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose a Trainer --</option>
                {trainers.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}
            {errors.trainer && (
              <p className="text-xs text-red-500">{errors.trainer}</p>
            )}
          </div>
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Membership Type
            </label>
            <select
              name="member"
              value={formData.member}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-white text-gray-800 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Membership</option>
              <option value="Basic">Basic</option>
              <option value="Premuim">Premuim</option>
              <option value="Elite">Elite</option>
            </select>
            {errors.Membership && (
              <p className="text-xs text-red-500">{errors.Membership}</p>
            )}
          </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-2 rounded-md font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
