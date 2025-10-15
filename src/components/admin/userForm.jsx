"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserForm from "./addUserForm";
import TrainerForm from "./TrainerForm";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Users"); // "Users" | "Trainers"
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);

  // modal state
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState(null); // "user" | "trainer"
  const [editData, setEditData] = useState(null);

  const colsForUsers = ["Name", "Membership", "Goal", "Class", "Trainer"];
  const colsForTrainers = ["Trainer", "ID"];

  // fetch both lists
  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, tRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/trainers"),
      ]);
      const [uJson, tJson] = await Promise.all([
        uRes.json().catch(() => []),
        tRes.json().catch(() => []),
      ]);
      setUsers(Array.isArray(uJson) ? uJson : uJson.users || []);
      setTrainers(Array.isArray(tJson) ? tJson : tJson.trainers || []);
    } catch (err) {
      console.error("fetchData error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = (type) => {
    setFormMode(type);
    setEditData(null);
    setShowForm(true);
  };

  const openEdit = (type, item) => {
    setFormMode(type);
    setEditData(item);
    setShowForm(true);
  };

  const closeForm = async (refresh = true) => {
    setShowForm(false);
    setEditData(null);
    setFormMode(null);
    if (refresh) await fetchData();
  };

  const handleDelete = async (type, id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`/api/admin/delete-${type}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchData();
    } catch (err) {
      console.error("delete error:", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-prestigeTeal">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 items-center mb-6">
        {["Users", "Trainers"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              activeTab === t
                ? "bg-gray-200 dark:bg-gray-700"
                : "bg-prestigeTeal text-white"
            }`}
          >
            {t}
          </button>
        ))}

        <div className="ml-auto flex gap-2">
          {activeTab === "Users" && (
            <button
              onClick={() => openAdd("user")}
              className="bg-prestigeTeal text-white px-4 py-2 rounded-md"
            >
              Add User
            </button>
          )}
          {activeTab === "Trainers" && (
            <button
              onClick={() => openAdd("trainer")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            >
              Add Trainer
            </button>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side: main table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">{activeTab} List</h2>
            <div className="text-sm text-gray-500">
              {loading
                ? "Refreshing..."
                : `${
                    activeTab === "Users" ? users.length : trainers.length
                  } records`}
            </div>
          </div>

          <div className="overflow-x-auto rounded-md">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  {(activeTab === "Users" ? colsForUsers : colsForTrainers).map(
                    (c) => (
                      <th key={c} className="px-3 py-2">
                        {c}
                      </th>
                    )
                  )}
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={activeTab === "Users" ? 6 : 3}
                      className="p-6 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : (activeTab === "Users" ? users : trainers).length === 0 ? (
                  <tr>
                    <td
                      colSpan={activeTab === "Users" ? 6 : 3}
                      className="p-6 text-center"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  (activeTab === "Users" ? users : trainers).map((it) => (
                    <tr
                      key={it._id || it.id}
                      className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {activeTab === "Users" ? (
                        <>
                          <td className="px-3 py-2">{it.username}</td>
                          <td className="px-3 py-2">{it.membershipType}</td>
                          <td className="px-3 py-2">{it.goal}</td>
                          <td className="px-3 py-2">{it.className}</td>
                          <td className="px-3 py-2">
                            {it.assignedTrainer?.name ?? "—"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-2">{it.trainerName}</td>
                          <td className="px-3 py-2">{it._id || it.id}</td>
                        </>
                      )}
                      <td className="px-3 py-2 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() =>
                              openEdit(
                                activeTab === "Users" ? "user" : "trainer",
                                it
                              )
                            }
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(
                                activeTab === "Users" ? "user" : "trainer",
                                it._id || it.id
                              )
                            }
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side: overview panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">
              {activeTab === "Users" ? "Trainers" : "Users"} Overview
            </h3>
            <div className="text-sm text-gray-500">
              {activeTab === "Users" ? trainers.length : users.length}
            </div>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-auto">
            {(activeTab === "Users" ? trainers : users).length === 0 ? (
              <div className="text-sm text-gray-500">No records</div>
            ) : (
              (activeTab === "Users" ? trainers : users).map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {activeTab === "Users"
                        ? item.trainerName || item.name
                        : item.username || item.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {activeTab === "Users"
                        ? item.specialty || ""
                        : item.email || ""}
                    </div>
                  </div>

                  {/* Hide edit/delete controls for inactive tab */}
                  {activeTab === "Users" ? (
                    // Viewing users — trainers are inactive, hide their edit/delete
                    <></>
                  ) : (
                    // Viewing trainers — users are inactive, hide their edit/delete
                    <></>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onMouseDown={() => closeForm(false)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl p-6 z-10"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                aria-label="Close form"
                onClick={() => closeForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              {formMode === "user" ? (
                <UserForm
                  editData={editData}
                  trainers={trainers}
                  onSuccess={() => closeForm(true)}
                  onCancel={() => closeForm(false)}
                />
              ) : (
                <TrainerForm
                  editData={editData}
                  onSuccess={() => closeForm(true)}
                  onCancel={() => closeForm(false)}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
