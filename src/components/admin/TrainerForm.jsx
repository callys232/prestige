"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TrainerForm({
  editData = null,
  onSuccess = () => {},
  onCancel = () => {},
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    goal: "",
    medicalCondition: "",
    userClass: "",
    role: "trainer",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const goals = [
    "build muscle",
    "lose weight",
    "improve endurance",
    "increase flexibility",
    "general fitness",
  ];

  const categories = [
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

  // Prefill form if editing
  useEffect(() => {
    if (editData) {
      setFormData({
        fullName: editData.fullName || editData.name || "",
        email: editData.email || "",
        goal: editData.goal || "",
        medicalCondition: editData.medicalCondition || "",
        userClass: editData.userClass || "",
        role: "trainer",
        password: "",
      });
      setErrors({});
      setStatus(null);
    } else {
      setFormData({
        fullName: "",
        email: "",
        goal: "",
        medicalCondition: "",
        userClass: "",
        role: "trainer",
        password: "",
      });
      setErrors({});
      setStatus(null);
    }
  }, [editData]);

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = "Name is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Invalid email";
    if (!formData.userClass) e.userClass = "Please select a category";
    if (!formData.goal) e.goal = "Please select a goal";
    if (!formData.password && !editData)
      e.password = "Password is required for new trainers";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eObj = validate();
    if (Object.keys(eObj).length) return setErrors(eObj);

    setSaving(true);
    setStatus(null);

    try {
      // Prepare payload
      const payload = { ...formData };
      if (editData && !payload.password) delete payload.password; // don't overwrite password if empty

      const url = editData
        ? `/api/auth/signup/${encodeURIComponent(editData._id || editData.id)}`
        : "/api/auth/signup";
      const method = editData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        if (json?.errors && typeof json.errors === "object") {
          setErrors((prev) => ({ ...prev, ...json.errors }));
        } else {
          setStatus({
            type: "error",
            text: json?.message || `Request failed (${res.status})`,
          });
        }
        return;
      }

      setStatus({
        type: "success",
        text: editData
          ? "Trainer updated successfully!"
          : "Trainer created successfully!",
      });

      onSuccess(json);
    } catch (err) {
      setStatus({ type: "error", text: err?.message || "Network error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {editData ? "Edit Trainer" : "Add Trainer"}
        </h3>
        {status && (
          <div
            className={`text-sm px-3 py-1 rounded ${
              status.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status.text}
          </div>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Full name"
        />
        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="email@example.com"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder={
            editData ? "Leave empty to keep current password" : "Enter password"
          }
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      {/* Goal */}
      <div>
        <label className="block text-sm font-medium mb-1">Goal</label>
        <select
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md bg-white"
        >
          <option value="">-- Select Goal --</option>
          {goals.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {errors.goal && (
          <p className="text-xs text-red-500 mt-1">{errors.goal}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="userClass"
          value={formData.userClass}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md bg-white"
        >
          <option value="">-- Select Category --</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.userClass && (
          <p className="text-xs text-red-500 mt-1">{errors.userClass}</p>
        )}
      </div>

      {/* About */}
      <div>
        <label className="block text-sm font-medium mb-1">About trainer</label>
        <textarea
          name="medicalCondition"
          value={formData.medicalCondition}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Coach background, certifications, short intro"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-prestigeTeal text-white rounded-md"
        >
          {saving
            ? editData
              ? "Saving..."
              : "Creating..."
            : editData
            ? "Save"
            : "Create"}
        </button>
      </div>
    </motion.form>
  );
}
