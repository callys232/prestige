"use client";

import { useState, useEffect } from "react";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    membershipType: "Basic",
    membershipExpires: "",
    assignedTrainer: "",
  });

  const [editUser, setEditUser] = useState(null);
  const [confirm, setConfirm] = useState({
    open: false,
    id: null,
    action: null,
    label: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load users (${res.status})`);
      const data = await res.json();
      const normalized = Array.isArray(data) ? data : data?.users || [];
      setUsers(
        normalized.map((u) => ({
          id: u._id || u.id || `${Math.random()}`,
          username: u.username || u.name || "—",
          email: u.email || "",
          phone: u.phone || "",
          status: u.status || "active",
          membershipType: u.membershipType || "Basic",
          membershipExpires: u.membershipExpires || null,
          assignedTrainer: u.assignedTrainer || "",
        }))
      );
    } catch (err) {
      // Fallback mock so UI still displays
      setUsers([
        {
          id: "mock-1",
          username: "Ada Lovelace",
          email: "ada@example.com",
          phone: "+2348000000000",
          status: "active",
          membershipType: "Premium",
          membershipExpires: new Date(Date.now() + 30 * 864e5).toISOString(),
          assignedTrainer: "trainer_1",
        },
        {
          id: "mock-2",
          username: "Chinua Achebe",
          email: "chinua@example.com",
          phone: "+2348111111111",
          status: "suspended",
          membershipType: "Basic",
          membershipExpires: null,
          assignedTrainer: "",
        },
      ]);
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };
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

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      phone: "",
      membershipType: "Basic",
      membershipExpires: "",
      assignedTrainer: "",
    });
    setEditUser(null);
    // leave statusMsg visible
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);
    try {
      let res, json;
      if (editUser) {
        res = await fetch(
          `/api/admin/update-user?id=${encodeURIComponent(editUser.id)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        json = await safeJson(res);
        if (!res.ok) throw new Error(json?.message || "Update failed");
        setStatusMsg({
          type: "success",
          text: json?.message || "User updated",
        });
      } else {
        res = await fetch("/api/admin/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        json = await safeJson(res);
        if (!res.ok) throw new Error(json?.message || "Create failed");
        setStatusMsg({
          type: "success",
          text: json?.message || "User created",
        });
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (user) => {
    setEditUser(user);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      membershipType: user.membershipType || "Basic",
      membershipExpires: user.membershipExpires
        ? new Date(user.membershipExpires).toISOString().slice(0, 10)
        : "",
      assignedTrainer: user.assignedTrainer || "",
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const confirmAction = (id, action) => {
    const label =
      action === "delete"
        ? "Delete permanently"
        : action === "suspend"
        ? "Suspend account"
        : "Reactivate account";
    setConfirm({ open: true, id, action, label });
  };

  const performAction = async () => {
    if (!confirm.id || !confirm.action) return;
    setSubmitting(true);
    setStatusMsg(null);
    try {
      let res, json;
      if (confirm.action === "delete") {
        res = await fetch(`/api/admin/delete-user?id=${confirm.id}`, {
          method: "DELETE",
        });
      } else if (confirm.action === "suspend") {
        res = await fetch(`/api/admin/suspend-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: confirm.id }),
        });
      } else if (confirm.action === "reactivate") {
        res = await fetch(`/api/admin/reactivate-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: confirm.id }),
        });
      }
      json = await safeJson(res);
      if (!res.ok) throw new Error(json?.message || "Action failed");
      setStatusMsg({
        type: "success",
        text: json?.message || "Action complete",
      });
      setConfirm({ open: false, id: null, action: null, label: "" });
      fetchUsers();
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
      setConfirm({ open: false, id: null, action: null, label: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Manager</h2>

      {/* Form */}
      <form onSubmit={handleCreateOrUpdate} className="space-y-2">
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="border px-2 py-1 rounded w-full"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border px-2 py-1 rounded w-full"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border px-2 py-1 rounded w-full"
        />
        <select
          name="membershipType"
          value={formData.membershipType}
          onChange={handleChange}
          className="border px-2 py-1 rounded w-full"
        >
          <option>Basic</option>
          <option>Premium</option>
          <option>VIP</option>
        </select>
        <input
          type="date"
          name="membershipExpires"
          value={formData.membershipExpires}
          onChange={handleChange}
          className="border px-2 py-1 rounded w-full"
        />
        <input
          name="assignedTrainer"
          value={formData.assignedTrainer}
          onChange={handleChange}
          placeholder="Assigned Trainer"
          className="border px-2 py-1 rounded w-full"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {submitting
              ? "Saving..."
              : editUser
              ? "Update User"
              : "Create User"}
          </button>
          {editUser && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {statusMsg && (
        <p
          className={`text-sm ${
            statusMsg.type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {statusMsg.text}
        </p>
      )}

      {/* User list */}
      <div className="space-y-2">
        {loading && <p>Loading users…</p>}
        {!loading && users.length === 0 && <p>No users found.</p>}
        {users.map((user) => (
          <div
            key={user.id}
            className="p-3 border rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-xs text-gray-500">
                {user.email || "No email"}
              </p>
              <p className="text-xs text-gray-500">
                {user.membershipType} —{" "}
                {user.membershipExpires
                  ? new Date(user.membershipExpires).toLocaleDateString()
                  : "No expiry"}
              </p>
              <p className="text-xs text-gray-500">Status: {user.status}</p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => openEdit(user)}
                className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100 transition"
              >
                Edit
              </button>
              {user.status === "suspended" ? (
                <button
                  onClick={() => confirmAction(user.id, "reactivate")}
                  className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-md hover:bg-green-100 transition"
                >
                  Reactivate
                </button>
              ) : (
                <button
                  onClick={() => confirmAction(user.id, "suspend")}
                  className="text-sm bg-yellow-50 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-100 transition"
                >
                  Suspend
                </button>
              )}
              <button
                onClick={() => confirmAction(user.id, "delete")}
                className="text-sm text-red-600 hover:underline ml-auto"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() =>
              setConfirm({ open: false, id: null, action: null, label: "" })
            }
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all animate-popup">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              {confirm.label}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to {confirm.action} this member? This action
              cannot be undone for delete.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setConfirm({ open: false, id: null, action: null, label: "" })
                }
                className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={performAction}
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:opacity-90 disabled:opacity-50"
              >
                {submitting
                  ? "Working..."
                  : confirm.action === "delete"
                  ? "Delete"
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes popup {
          from {
            transform: translateY(8px) scale(0.98);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .animate-popup {
          animation: popup 180ms cubic-bezier(0.2, 0.9, 0.3, 1);
        }
      `}</style>
    </div>
  );
}

// Safe JSON parse helper
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
