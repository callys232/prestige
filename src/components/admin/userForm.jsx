"use client";
import { useState, useRef } from "react";

export default function UserForm({ section = "User Management", onSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    membershipType: "",
    assignedTrainer: "",
    trainerName: "",
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const firstFieldRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      if (value.length < 6) setPasswordStrength("Weak");
      else if (value.length < 10) setPasswordStrength("Medium");
      else setPasswordStrength("Strong");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Save failed");

      setStatus({ type: "success", text: result.message || "Saved!" });
      setFormData({
        username: "",
        password: "",
        membershipType: "",
        assignedTrainer: "",
        trainerName: "",
      });

      if (firstFieldRef.current) firstFieldRef.current.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });

      // 🔑 Notify parent on success
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
          {/* Username */}
          <label htmlFor="username" className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Full name
            </span>
            <input
              id="username"
              ref={firstFieldRef}
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              disabled={submitting}
              className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
              required
            />
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
              className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md pr-16"
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
          </label>

          {/* Membership Type */}
          <label htmlFor="membershipType" className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Membership Type
            </span>
            <select
              id="membershipType"
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
              disabled={submitting}
              className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
              required
            >
              <option value="">Select membership</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Elite">Elite</option>
            </select>
          </label>

          {/* Assigned Trainer */}
          <label htmlFor="assignedTrainer" className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Assigned Trainer
            </span>
            <div className="mt-1">
              <select
                id="assignedTrainer"
                name="assignedTrainer"
                value={formData.assignedTrainer}
                onChange={handleChange}
                disabled={loadingTrainers || submitting}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
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
              onClick={() =>
                setFormData({
                  username: "",
                  password: "",
                  membershipType: "",
                  assignedTrainer: "",
                  trainerName: "",
                })
              }
              className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      )}

      {/* Trainer Management Form */}
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
              placeholder="e.g., Musa Ahmed"
              disabled={submitting}
              className="w-full mt-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
              required
            />
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
      )}

      {/* Bookings & Attendance Placeholder */}
      {section === "Bookings & Attendance" && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Booking module coming soon...
        </div>
      )}

      {/* Status Message */}
      {status && (
        <div
          className={`mt-4 px-3 py-2 rounded-md text-sm ${
            status.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {status.text}
        </div>
      )}
    </div>
  );
}
