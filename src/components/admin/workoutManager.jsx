"use client";
import { useState, useEffect } from "react";

export default function AdminWorkoutPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [newPlan, setNewPlan] = useState("");
  const [editingPlan, setEditingPlan] = useState(null);
  const [editName, setEditName] = useState("");

  const getId = (plan) => plan._id || plan.id;

  // 🔹 FETCH ALL PLANS
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/plans");
      const data = await res.json();
      setPlans(data.plans || []);
      setStatus(null);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "❌ Failed to load workout plans" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") cancelEdit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 🔹 CREATE
  const addPlan = async (e) => {
    e.preventDefault();
    if (!newPlan.trim()) return;
    const tempPlan = { id: Date.now(), name: newPlan };
    setPlans((prev) => [...prev, tempPlan]);
    setNewPlan("");
    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tempPlan.name }),
      });
      if (!res.ok) throw new Error("Add failed");
      setStatus({ type: "success", msg: "✅ Plan added!" });
      fetchPlans();
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "❌ Error adding plan." });
      setPlans((prev) => prev.filter((p) => p.id !== tempPlan.id));
    }
  };

  // 🔹 EDIT
  const startEdit = (plan) => {
    setEditingPlan(plan);
    setEditName(plan.name);
    setStatus(null);
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;
    const updatedPlans = plans.map((p) =>
      getId(p) === getId(editingPlan) ? { ...p, name: editName } : p
    );
    setPlans(updatedPlans);
    setEditingPlan(null);
    try {
      const res = await fetch(`/api/plans/${getId(editingPlan)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      if (!res.ok) throw new Error("Update failed");
      setStatus({ type: "success", msg: "✅ Plan updated!" });
      fetchPlans();
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "❌ Error updating plan." });
      fetchPlans();
    }
  };

  // 🔹 DELETE
  const deletePlan = async (id) => {
    if (!confirm("⚠️ Are you sure you want to delete this plan?")) return;
    const originalPlans = [...plans];
    setPlans((prev) => prev.filter((p) => getId(p) !== id));
    try {
      const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setStatus({ type: "success", msg: "🗑️ Plan deleted!" });
      fetchPlans();
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", msg: "❌ Error deleting plan." });
      setPlans(originalPlans);
    }
  };

  const cancelEdit = () => setEditingPlan(null);

  // 🔹 UI SECTION
  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-blue-50 shadow-md rounded-xl border border-blue-100">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">🏋️‍♂️ Workout Plans</h1>
        <button
          onClick={fetchPlans}
          className="px-4 py-2 text-sm border border-blue-300 bg-blue-400 rounded hover:bg-blue-100 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* STATUS MESSAGE */}
      {status && (
        <div
          className={`mb-5 p-3 rounded-md text-center font-medium ${
            status.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.msg}
        </div>
      )}

      {/* ADD FORM */}
      <form
        onSubmit={addPlan}
        className="flex items-center gap-3 mb-8 bg-blue text-blue-800 border border-blue-500 p-4 rounded-lg shadow-sm"
      >
        <input
          aria-label="New workout plan name"
          type="text"
          value={newPlan}
          onChange={(e) => setNewPlan(e.target.value)}
          placeholder="Enter new workout plan"
          className="flex-1 px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button
          type="submit"
          aria-label="Add workout plan"
          className="px-5 py-2 bg-blue-600 text-blue rounded hover:bg-blue-700 transition font-medium"
        >
          ➕ Add
        </button>
      </form>

      {/* TABLE */}
      <div className="overflow-x-auto bg-blue-400 border border-blue-100 rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-blue-100 text-blue-900 uppercase text-xs">
              <th className="px-4 py-3 border-b text-left">#</th>
              <th className="px-4 py-3 border-b text-left">Workout Plan</th>
              <th className="px-4 py-3 border-b text-center w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  <div className="animate-spin h-6 w-6 mx-auto border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </td>
              </tr>
            ) : plans.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No workout plans available.
                </td>
              </tr>
            ) : (
              plans.map((plan, i) => (
                <tr
                  key={getId(plan)}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-3 border-b">{i + 1}</td>
                  <td className="px-4 py-3 border-b font-medium">
                    {plan.name}
                  </td>
                  <td className="px-4 py-3 border-b text-center space-x-2">
                    <button
                      onClick={() => startEdit(plan)}
                      aria-label={`Edit ${plan.name}`}
                      className="px-3 py-1 bg-blue-600 text-blue-400 rounded hover:bg-blue-700 text-xs"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deletePlan(getId(plan))}
                      aria-label={`Delete ${plan.name}`}
                      className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 text-xs"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-blue-400 border border-blue-100 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              ✏️ Edit Plan
            </h2>
            <input
              aria-label="Edit workout plan name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border border-blue-200 rounded-md mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-green-600 text-blue-500 rounded hover:bg-green-700 transition text-sm"
              >
                💾 Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
