"use client";

import { useState, useEffect } from "react";

/**
 * Enhanced UserManager for gym admin
 * - Shows members list with status, membership expiry, trainer
 * - Create new member (membership type, expiry, trainer, contact)
 * - Edit, Delete, Suspend, Reactivate actions with confirmation modal
 * - Loading / submitting states and inline status messages
 *
 * Expects backend endpoints:
 * GET    /api/admin/users
 * POST   /api/admin/create-user
 * PUT    /api/admin/update-user?id=...
 * DELETE /api/admin/delete-user?id=...
 * POST   /api/admin/action-user  { id, action }
 */

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
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(
        data.map((u) => ({
          id: u._id || u.id,
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
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

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
    setStatusMsg(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setStatusMsg(null);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editUser) {
        const res = await fetch(
          `/api/admin/update-user?id=${encodeURIComponent(editUser.id)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Update failed");
        setStatusMsg({ type: "success", text: json.message || "User updated" });
      } else {
        const res = await fetch("/api/admin/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Create failed");
        setStatusMsg({ type: "success", text: json.message || "User created" });
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    const { id, action } = confirm;
    setConfirm({ ...confirm, open: false });
    setSubmitting(true);
    try {
      if (action === "delete") {
        const res = await fetch(
          `/api/admin/delete-user?id=${encodeURIComponent(id)}`,
          { method: "DELETE" }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Delete failed");
        setStatusMsg({ type: "success", text: json.message || "User deleted" });
      } else {
        const res = await fetch(`/api/admin/action-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Action failed");
        setStatusMsg({
          type: "success",
          text: json.message || "Action completed",
        });
      }
      fetchUsers();
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-[1.01]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {editUser ? "Edit Member" : "Add New Member"}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-300">
            {loading ? "Loading..." : `${users.length} members`}
          </div>
        </div>

        <form
          onSubmit={handleCreateOrUpdate}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Full name"
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md w-full"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md w-full"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md w-full"
          />
          <select
            name="membershipType"
            value={formData.membershipType}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md w-full"
          >
            <option>Basic</option>
            <option>Premium</option>
            <option>Elite</option>
          </select>

          <input
            name="membershipExpires"
            type="date"
            value={formData.membershipExpires}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md w-full"
          />
          <input
            name="assignedTrainer"
            value={formData.assignedTrainer}
            onChange={handleChange}
            placeholder="Assigned trainer"
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md w-full"
          />

          <div className="md:col-span-2 flex gap-3 items-center">
            <button
              type="submit"
              disabled={submitting}
              className="bg-prestigeTeal text-white px-4 py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting
                ? editUser
                  ? "Updating..."
                  : "Creating..."
                : editUser
                ? "Update Member"
                : "Create Member"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
            {editUser && (
              <button
                type="button"
                onClick={() => confirmAction(editUser.id, "delete")}
                className="ml-auto text-sm text-red-600 hover:underline"
              >
                Delete Member
              </button>
            )}
          </div>
        </form>

        {statusMsg && (
          <div
            className={`mt-4 px-4 py-2 rounded-md text-sm ${
              statusMsg.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {statusMsg.text}
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-gray-500">Loading members...</div>
        ) : users.length === 0 ? (
          <div className="text-gray-500">No members found.</div>
        ) : (
          users.map((user) => {
            const isExpired =
              user.membershipExpires &&
              new Date(user.membershipExpires) < new Date();
            return (
              <div
                key={user.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-700 dark:text-gray-100">
                    {user.username
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {user.username}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          {user.email || user.phone || "No contact"}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === "suspended"
                                ? "bg-yellow-50 text-yellow-800"
                                : isExpired
                                ? "bg-red-50 text-red-800"
                                : "bg-green-50 text-green-800"
                            }`}
                          >
                            {user.status === "suspended"
                              ? "Suspended"
                              : isExpired
                              ? "Expired"
                              : "Active"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          {user.membershipType} •{" "}
                          {user.assignedTrainer || "No trainer"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
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
                </div>
              </div>
            );
          })
        )}
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
