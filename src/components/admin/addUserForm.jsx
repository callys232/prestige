"use client";

import { useState, useEffect } from "react";

export default function UserForm({ editData, trainers, onSuccess, onCancel }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [membership, setMembership] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [userClass, setUserClass] = useState("");
  const [trainerId, setTrainerId] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // Updated dropdown options
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

  // Prefill fields when editing
  useEffect(() => {
    if (editData) {
      setUsername(editData.username || "");
      setEmail(editData.email || "");
      setMembership(editData.membership || "");
      setGender(editData.gender || "");
      setGoal(editData.goal || "");
      setUserClass(editData.userClass || "");
      setTrainerId(editData.trainerId?._id || editData.trainerId || "");
    } else {
      setUsername("");
      setEmail("");
      setMembership("");
      setGender("");
      setGoal("");
      setUserClass("");
      setTrainerId("");
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editData ? "PATCH" : "POST";
      const url = editData ? `/api/users/${editData._id}` : "/api/users";

      const payload = {
        username,
        email,
        membership,
        gender,
        goal,
        userClass,
        trainerId: trainerId || null,
        role: "client",
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save user");
      }

      onSuccess();
    } catch (err) {
      console.error(err);
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
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Membership</label>
          <select
            value={membership}
            onChange={(e) => setMembership(e.target.value)}
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
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Goal</label>
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
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
          value={userClass}
          onChange={(e) => setUserClass(e.target.value)}
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
          value={trainerId}
          onChange={(e) => setTrainerId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Trainer</option>
          {trainers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.username || t.name}
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
