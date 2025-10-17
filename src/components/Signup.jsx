"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupForm() {
  const searchParams = useSearchParams();
  const prefilluserClass = searchParams.get("userClass") || "";
  const prefilltrainerId = searchParams.get("trainerId") || "";

  const [trainers, setTrainers] = useState([]); // ✅ lowercase variable name

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    goal: "",
    userClass: "",
    membership: "",
    medicalCondition: "",
    trainerId: prefilltrainerId || "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch trainers dynamically
  useEffect(() => {
    async function fetchTrainers() {
      try {
        const res = await fetch("/api/users?role=trainer");
        const json = await res.json();

        if (res.ok && json.success) {
          setTrainers(json.data || []);
        } else {
          console.error("Failed to fetch trainers:", json.message);
        }
      } catch (err) {
        console.error("Error fetching trainers:", err);
      }
    }

    fetchTrainers();
  }, []);

  // ✅ Prefill URL params
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userClass: prefilluserClass || prev.userClass,
      trainerId: prefilltrainerId || prev.trainerId,
    }));
  }, [prefilluserClass, prefilltrainerId]);

  const goals = [
    "build muscle",
    "lose weight",
    "improve endurance",
    "increase flexibility",
    "general fitness",
  ];

  const classes = [
    "dance fitness",
    "zumba fusion",
    "afro dance burn",
    "kid fitness",
    "junior bootcamp",
    "mini movers",
    "muscle marathon",
    "endurance builder",
    "hiit express",
    "press to burn",
    "cardio blast",
  ];

  // ✅ Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.gender) newErrors.gender = "Please select a gender";
    if (!formData.goal) newErrors.goal = "Please select a goal";
    if (!formData.trainerId) newErrors.trainerId = "Please select a trainer";
    return newErrors;
  };

  // ✅ Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
        if (json?.errors && typeof json.errors === "object") {
          setErrors((prev) => ({ ...prev, ...json.errors }));
        } else {
          setServerError(message);
        }
        return;
      }

      window.location.href = `/verify?email=${encodeURIComponent(
        formData.email
      )}`;
    } catch (err) {
      setServerError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Form UI
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
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName}</p>
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
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500">{errors.gender}</p>
            )}
          </div>

          {/* Goal */}
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
              name="userClass"
              value={formData.userClass}
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

          {/* Medical Condition */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Health Recommendations
            </label>
            <textarea
              name="medicalCondition"
              value={formData.medicalCondition}
              onChange={handleChange}
              placeholder="Any health notes or recommendations"
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Trainer */}
          <div>
            <label className="block text-sm font-medium mb-1">Trainer</label>
            {prefilltrainerId ? (
              <input
                type="text"
                name="trainerId"
                value={formData.trainerId}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
              />
            ) : (
              <select
                name="trainerId"
                value={formData.trainerId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-white text-gray-800 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose a Trainer --</option>
                {trainers.length > 0 ? (
                  trainers.map((trainer) => (
                    <option key={trainer._id} value={trainer._id}>
                      {trainer.fullName || trainer.username || trainer.email}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading trainers...</option>
                )}
              </select>
            )}
            {errors.trainerId && (
              <p className="text-xs text-red-500">{errors.trainerId}</p>
            )}
          </div>

          {/* Membership */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Membership Type
            </label>
            <select
              name="membership"
              value={formData.membership}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-white text-gray-800 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Membership</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="elite">Elite</option>
            </select>
            {errors.membership && (
              <p className="text-xs text-red-500">{errors.membership}</p>
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
