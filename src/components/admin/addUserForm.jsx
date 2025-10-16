"use client";

import { useState, useEffect } from "react";

export default function UserForm({ editData, trainers, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    membership: "",
    gender: "",
    goal: "",
    userClass: "",
    trainerId: "",
    role: "client",
  });

  const [submitting, setSubmitting] = useState(false);

  const memberships = ["basic", "elite", "premium"];
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

  // Prefill form if editing
  useEffect(() => {
    if (editData) {
      setFormData({
        fullName: editData.fullName || "",
        email: editData.email || "",
        password: "",
        membership: editData.membership || "",
        gender: editData.gender || "",
        goal: editData.goal || "",
        userClass: editData.userClass || "",
        trainerId: editData.trainerId?._id || editData.trainerId || "",
        role: "client",
      });
    } else {
      setFormData({
        fullName: "",
        password: "",
        email: "",
        membership: "",
        gender: "",
        goal: "",
        userClass: "",
        trainerId: "",
        role: "client",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // ✅ Log payload before sending
    console.log("Submitting user payload:", formData);

    try {
      const method = editData ? "PATCH" : "POST";
      const url = editData ? `/api/users/${editData._id}` : "/api/auth/signup";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let errMsg = "Failed to save user";
        try {
          const errData = await res.json();
          errMsg = errData.message || errMsg;
        } catch (err) {
          console.warn("Failed to parse error JSON:", err);
        }
        throw new Error(errMsg);
      }

      const responseData = await res.json().catch(() => null);
      console.log("Server response:", responseData);

      onSuccess(responseData);
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">
        {editData ? "Edit User" : "Add User"}
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!editData} // Password is required only when adding a new user
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Membership</label>
          <select
            name="membership"
            value={formData.membership}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Membership</option>
            {memberships.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Goal</label>
        <select
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Goal</option>
          {goals.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Class</label>
        <select
          name="userClass"
          value={formData.userClass}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Trainer</label>
        <select
          name="trainerId"
          // value={formData.trainerId}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Trainer</option>
          {trainers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.fullName || t.username || "—"}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-prestigeTeal text-white rounded hover:bg-teal-600 disabled:opacity-50"
        >
          {submitting ? "Saving..." : editData ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
