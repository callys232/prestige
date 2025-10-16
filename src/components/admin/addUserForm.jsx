"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function UserForm({ section = "User Management", onSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    membership: "",
    trainerId: "68bab26c86e2ecf4a6f51e9b",
    goal: "",
    userClass: "",
    medicalCondition: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const firstFieldRef = useRef();

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

  // 🔹 Fetch trainers
  useEffect(() => {
    if (section !== "User Management") return;

    const fetchTrainers = async () => {
      setLoadingTrainers(true);
      try {
        const res = await fetch("/api/users?role=trainer");
        const data = await res.json();
        setTrainers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch trainers:", err);
      } finally {
        setLoadingTrainers(false);
      }
    };

    fetchTrainers();
  }, [section]);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      if (value.length < 6) setPasswordStrength("Weak");
      else if (value.length < 10) setPasswordStrength("Medium");
      else setPasswordStrength("Strong");
    }
  };

  // 🔹 Reset form
  const resetForm = () => {
    setFormData({
      username: "",
      fullName: "",
      password: "",
      membership: "",
      trainerId: "",
      // trainerName: "",
      goal: "",
      userClass: "",
      medicalCondition: "",
    });
    setPasswordStrength(null);
    setErrors({});
  };

  // 🔹 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    // ✅ Basic Validation
    const newErrors = {};
    if (section === "User Management") {
      if (!formData.fullName.trim())
        newErrors.fullName = "Full name is required";

      if (!formData.username.trim()) newErrors.username = "Name is required";
      if (!formData.password.trim())
        newErrors.password = "Password is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
        newErrors.email = "Invalid email address";
      if (!formData.membership)
        newErrors.membership = "Membership type is required";
      if (!formData.goal) newErrors.goal = "Please select a goal";
      if (!formData.userClass) newErrors.userClass = "Please select a class";
    } else if (section === "Trainer Management") {
      if (!formData.trainerId.trim())
        newErrors.trainerId = "Trainer name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    try {
      const endpoint =
        section === "Trainer Management"
          ? "/api/auth/signup"
          : "/api/auth/signup";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log(formData);
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Save failed");

      setStatus({ type: "success", text: result.message || "Saved!" });
      resetForm();

      if (firstFieldRef.current) firstFieldRef.current.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (onSuccess) onSuccess();
    } catch (err) {
      setStatus({
        type: "error",
        text: err.message || "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 w-full max-w-lg transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        {section}
      </h2>

      {/* User Management Form */}
      {section === "User Management" && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-label="Add member form"
        >
          {/* Full Name */}
          <label htmlFor="fullName" className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Full Name
            </span>
            <input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g., prestige gym"
              disabled={submitting}
              className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName}</p>
            )}
          </label>
          {/* Username */}
          <label htmlFor="username" className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              user name
            </span>
            <input
              id="username"
              ref={firstFieldRef}
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              disabled={submitting}
              className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username}</p>
            )}
          </label>
          {/* Email */}
          <label htmlFor="email" className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Email Address
            </span>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., prestigeuser@gmail"
              disabled={submitting}
              className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </label>

          {/* Password */}
          <label htmlFor="password" className="block relative">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Password
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a strong password"
              disabled={submitting}
              className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md pr-16 focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-xs text-gray-500"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {passwordStrength && (
              <p
                className={`text-xs mt-1 ${
                  passwordStrength === "Weak"
                    ? "text-red-500"
                    : passwordStrength === "Medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                Strength: {passwordStrength}
              </p>
            )}
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </label>

          {/* Membership Type */}
          <label htmlFor="membership" className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Membership Type
            </span>
            <select
              id="membership"
              name="membership"
              value={formData.membership}
              onChange={handleChange}
              disabled={submitting}
              className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select membership</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="elite">Elite</option>
            </select>
            {errors.membership && (
              <p className="text-xs text-red-500">{errors.membership}</p>
            )}
          </label>

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
            {errors.className && (
              <p className="text-xs text-red-500">{errors.userClass}</p>
            )}
          </div>

          {/* Health Recommendations */}
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
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Assigned Trainer */}
          <label htmlFor="assignedTrainer" className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Assigned Trainer
            </span>
            <div className="mt-1">
              <select
                id="trainerId"
                name="trainerId"
                value={formData.trainerId}
                onChange={handleChange}
                disabled={loadingTrainers || submitting}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No trainer</option>
                {trainers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {loadingTrainers && (
                <p className="text-xs text-gray-400 mt-1">
                  Loading trainers...
                </p>
              )}
            </div>
          </label>

          {/* Buttons */}
          <div className="flex gap-3 items-center">
            <button
              type="submit"
              disabled={submitting}
              className="bg-prestigeTeal text-white px-4 py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Add Member"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      )}

      {/* Trainer Management Form
      {section === "Trainer Management" && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-label="Add trainer form"
        >
          <label htmlFor="trainerName" className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Trainer Name
            </span>
            <input
              id="trainerName"
              name="trainerName"
              value={formData.trainerName}
              onChange={handleChange}
              placeholder="e.g., Trainer Dave"
              disabled={submitting}
              className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.trainerName && (
              <p className="text-xs text-red-500">{errors.trainerName}</p>
            )}
          </label>

          <div className="flex gap-3 items-center">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Trainer"}
            </button>
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, trainerName: "" }))}
              className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      )} */}

      {/* Bookings & Attendance Placeholder */}
      {section === "Bookings & Attendance" && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Booking module coming soon...
        </div>
      )}

      {/* Status Message */}
      {status && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          aria-live="polite"
          className={`mt-4 px-3 py-2 rounded-md text-sm ${
            status.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {status.text}
        </motion.div>
      )}
    </div>
  );
}
