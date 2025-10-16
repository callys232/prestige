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

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState(null); // "user" | "trainer"
  const [editData, setEditData] = useState(null);

  const colsForUsers = [
    "Name",
    "Membership",
    "Gender",
    "Goal",
    "Class",
    "Trainer",
  ];
  const colsForTrainers = ["Trainer", "ID"];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, tRes] = await Promise.all([
        fetch("/api/users?role=client"),
        fetch("/api/users?role=trainer"),
      ]);

      const uJson = await uRes.json();
      const tJson = await tRes.json();

      const clients = Array.isArray(uJson.data ?? uJson)
        ? uJson.data ?? uJson
        : [];
      const trainersData = Array.isArray(tJson.data ?? tJson)
        ? tJson.data ?? tJson
        : [];

      setUsers(clients);
      setTrainers(trainersData);

      // ✅ Log the actual fetched data, not state
      console.log("Clients:", clients);
      console.log("Trainers:", trainersData);
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
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchData();
    } catch (err) {
      console.error("delete error:", err);
      alert("Delete failed");
    }
  };

  const records = activeTab === "Users" ? users : trainers;

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-prestigeTeal">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-4 items-center mb-4 sm:mb-6">
        {["Users", "Trainers"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md font-semibold transition text-sm sm:text-base ${
              activeTab === t
                ? "bg-gray-200 dark:bg-gray-700"
                : "bg-prestigeTeal text-white"
            }`}
          >
            {t}
          </button>
        ))}

        <div className="ml-auto flex gap-2 flex-wrap">
          {activeTab === "Users" && (
            <button
              onClick={() => openAdd("user")}
              className="bg-prestigeTeal text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base"
            >
              Add User
            </button>
          )}
          {activeTab === "Trainers" && (
            <button
              onClick={() => openAdd("trainer")}
              className="bg-indigo-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base"
            >
              Add Trainer
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left side: table (desktop) / cards (mobile) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 overflow-x-auto">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-lg sm:text-xl font-semibold">
              {activeTab} List
            </h2>
            <div className="text-xs sm:text-sm text-gray-500">
              {loading ? "Refreshing..." : `${records.length} records`}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block">
            <table className="min-w-full text-sm sm:text-base">
              <thead>
                <tr className="text-left text-xs sm:text-sm text-gray-500 uppercase">
                  {(activeTab === "Users" ? colsForUsers : colsForTrainers).map(
                    (c) => (
                      <th key={c} className="px-2 sm:px-3 py-1 sm:py-2">
                        {c}
                      </th>
                    )
                  )}
                  <th className="px-2 sm:px-3 py-1 sm:py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={activeTab === "Users" ? 6 : 3}
                      className="p-4 sm:p-6 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td
                      colSpan={activeTab === "Users" ? 6 : 3}
                      className="p-4 sm:p-6 text-center"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  records.map((it) => (
                    <tr
                      key={it._id || it.id}
                      className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {activeTab === "Users" ? (
                        <>
                          <td className="px-2 sm:px-3 py-1 sm:py-2">
                            {it.fullName}
                          </td>
                          <td className="px-2 sm:px-3 py-1 sm:py-2">
                            {it.membership}
                          </td>
                          <td className="px-2 sm:px-3 py-1 sm:py-2">
                            {it.gender}
                          </td>
                          <td className="px-2 sm:px-3 py-1 sm:py-2">
                            {it.goal}
                          </td>
                          <td className="px-2 sm:px-3 py-1 sm:py-2">
                            {it.userClass}
                          </td>
                          <td className="px-2 sm:px-3 py-1 sm:py-2">
                            {trainers.find((t) => t._id === it.trainerId)
                              ?.fullName ?? "—"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 sm:px-3 py-1 sm:py-2">
                            {it.fullName}
                          </td>
                          <td className="px-2 sm:px-3 py-1 sm:py-2">
                            {it._id || it.id}
                          </td>
                        </>
                      )}
                      <td className="px-2 sm:px-3 py-1 sm:py-2 text-center">
                        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                          <button
                            onClick={() =>
                              openEdit(
                                activeTab === "Users" ? "user" : "trainer",
                                it
                              )
                            }
                            className="text-blue-600 hover:underline text-xs sm:text-sm"
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
                            className="text-red-600 hover:underline text-xs sm:text-sm"
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

          {/* Mobile Cards */}
          <div className="sm:hidden flex flex-col gap-3">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : records.length === 0 ? (
              <div className="text-center py-4">No records found.</div>
            ) : (
              records.map((it) => (
                <div
                  key={it._id || it.id}
                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow flex flex-col gap-1"
                >
                  {activeTab === "Users" ? (
                    <>
                      <div>
                        <span className="font-semibold">Name:</span>{" "}
                        {it.fullName}
                      </div>
                      <div>
                        <span className="font-semibold">Membership:</span>{" "}
                        {it.membership}
                      </div>
                      <div>
                        <span className="font-semibold">Gender:</span>{" "}
                        {it.gender}
                      </div>
                      <div>
                        <span className="font-semibold">Goal:</span> {it.goal}
                      </div>
                      <div>
                        <span className="font-semibold">Class:</span>{" "}
                        {it.userClass}
                      </div>
                      <div>
                        <span className="font-semibold">Trainer:</span>{" "}
                        {trainers.find((t) => t._id === it.trainerId)
                          ?.fullName ?? "—"}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="font-semibold">Trainer:</span>{" "}
                        {it.fullName}
                      </div>
                      <div>
                        <span className="font-semibold">ID:</span>{" "}
                        {it._id || it.id}
                      </div>
                    </>
                  )}
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() =>
                        openEdit(activeTab === "Users" ? "user" : "trainer", it)
                      }
                      className="text-blue-600 hover:underline text-xs"
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
                      className="text-red-600 hover:underline text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right side: overview panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 max-h-[60vh] overflow-auto">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-base sm:text-lg font-semibold">
              {activeTab === "Users" ? "Trainers" : "Users"} Overview
            </h3>
            <div className="text-xs sm:text-sm text-gray-500">
              {activeTab === "Users" ? trainers.length : users.length}
            </div>
          </div>

          <div className="space-y-2 overflow-auto">
            {(activeTab === "Users" ? trainers : users).length === 0 ? (
              <div className="text-xs sm:text-sm text-gray-500">No records</div>
            ) : (
              (activeTab === "Users" ? trainers : users).map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex flex-col sm:flex-row sm:gap-2">
                    <div className="text-sm sm:text-base font-medium">
                      {item.fullName}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {item.email || ""}
                    </div>
                  </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onMouseDown={() => closeForm(false)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-full sm:max-w-2xl p-4 sm:p-6 z-10"
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
