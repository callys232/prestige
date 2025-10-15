// src/components/admin/TrainerForm.jsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TrainerForm({
  editData = null,
  onSuccess = () => {},
  onCancel = () => {},
}) {
  const [formData, setFormData] = useState({
    trainerName: "",
    email: "",
    phone: "",
    specialty: "",
    bio: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const categories = [
    "Strength",
    "Cardio",
    "Flexibility",
    "Kids",
    "Dance",
    "HIIT",
    "Endurance",
    "General",
  ];

  useEffect(() => {
    if (editData) {
      setFormData({
        trainerName: editData.trainerName || editData.name || "",
        email: editData.email || "",
        phone: editData.phone || "",
        specialty: editData.specialty || "",
        bio: editData.bio || "",
        category: editData.category || "",
      });
      setStatus(null);
      setErrors({});
    } else {
      setFormData({
        trainerName: "",
        email: "",
        phone: "",
        specialty: "",
        bio: "",
        category: "",
      });
    }
  }, [editData]);

  const validate = () => {
    const e = {};
    if (!formData.trainerName.trim()) e.trainerName = "Name is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Invalid email";
    if (!formData.category) e.category = "Please select a category";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setStatus(null);
    const eObj = validate();
    if (Object.keys(eObj).length) {
      setErrors(eObj);
      return;
    }

    setSaving(true);
    try {
      const payload = { ...formData };
      const url = editData
        ? `/api/trainers/${encodeURIComponent(editData._id || editData.id)}`
        : "/api/trainers";
      const method = editData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        if (json?.errors && typeof json.errors === "object") {
          setErrors((p) => ({ ...p, ...json.errors }));
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
        text: editData ? "Trainer updated." : "Trainer created.",
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

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="trainerName"
          value={formData.trainerName}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Full name"
        />
        {errors.trainerName && (
          <p className="text-xs text-red-500 mt-1">{errors.trainerName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
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

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="+234 800 000 0000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Specialty</label>
        <input
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="e.g., Strength training, Yoga"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md bg-blue"
        >
          <option className="bg-blue">-- Select category --</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-xs text-red-500 mt-1">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">About trainer</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Coach background, certifications, short intro"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-md bg-prestigeTeal text-white"
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
