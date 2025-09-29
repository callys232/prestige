"use client";

import { useState } from "react";

const UserForm = ({ section }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    membershipType: "",
    assignedTrainer: "",
    trainerName: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let endpoint = "";
      let payload = {};

      if (section === "User Management") {
        endpoint = "/api/admin/create-user";
        payload = {
          username: formData.username,
          password: formData.password,
          membershipType: formData.membershipType,
          assignedTrainer: formData.assignedTrainer,
        };
      } else if (section === "Trainer Management") {
        endpoint = "/api/admin/create-trainer";
        payload = {
          trainerName: formData.trainerName,
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus({ success: true, message: result.message || "Saved!" });
        setFormData({
          username: "",
          password: "",
          membershipType: "",
          assignedTrainer: "",
          trainerName: "",
        });
      } else {
        throw new Error(result.message || "Something went wrong.");
      }
    } catch (err) {
      setStatus({ success: false, message: err.message });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 w-full max-w-lg transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        {section}
      </h2>

      {section === "User Management" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
            required
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
            required
          />
          <select
            name="membershipType"
            value={formData.membershipType}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
            required
          >
            <option value="">Select Membership Type</option>
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="Elite">Elite</option>
          </select>
          <input
            name="assignedTrainer"
            value={formData.assignedTrainer}
            onChange={handleChange}
            placeholder="Assigned Trainer"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
          />
          <button
            type="submit"
            className="bg-prestigeTeal text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
          >
            Add Member
          </button>
        </form>
      )}

      {section === "Trainer Management" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="trainerName"
            value={formData.trainerName}
            onChange={handleChange}
            placeholder="Trainer Name"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Add Trainer
          </button>
        </form>
      )}

      {section === "Bookings & Attendance" && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Booking module coming soon...
        </div>
      )}

      {status && (
        <p
          className={`mt-4 text-sm ${
            status.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
};

export default UserForm;
