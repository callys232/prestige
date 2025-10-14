"use client";
import { useState, useEffect } from "react";

function ExerciseForm({ planId, onAdded }) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !sets || !reps) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/add-exercise?planId=${planId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sets, reps }),
      });
      const result = await res.json();
      onAdded(result.message, res.ok);
      setName("");
      setSets("");
      setReps("");
    } catch (err) {
      onAdded("Failed to add exercise", false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2 items-center">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Exercise"
        className="px-2 py-1 border rounded text-sm"
      />
      <input
        value={sets}
        onChange={(e) => setSets(e.target.value)}
        placeholder="Sets"
        className="w-16 px-2 py-1 border rounded text-sm"
      />
      <input
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        placeholder="Reps"
        className="w-16 px-2 py-1 border rounded text-sm"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
      >
        {submitting ? "Adding…" : "Add"}
      </button>
    </form>
  );
}

export default function WorkoutManager() {
  const [plans, setPlans] = useState([]);
  const [planName, setPlanName] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/workout-plans");
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      setStatus({ msg: "Failed to load plans", ok: false });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!planName.trim()) return;
    try {
      const res = await fetch("/api/admin/create-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: planName }),
      });
      const result = await res.json();
      setStatus({ msg: result.message, ok: res.ok });
      setPlanName("");
      fetchPlans();
    } catch {
      setStatus({ msg: "Failed to create plan", ok: false });
    }
  };

  const handleDeletePlan = async (id) => {
    try {
      const res = await fetch(`/api/admin/delete-workout?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      setStatus({ msg: result.message, ok: res.ok });
      fetchPlans();
    } catch {
      setStatus({ msg: "Failed to delete plan", ok: false });
    }
  };

  const handleDeleteExercise = async (planId, exerciseId) => {
    try {
      const res = await fetch(
        `/api/admin/delete-exercise?planId=${planId}&exerciseId=${exerciseId}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      setStatus({ msg: result.message, ok: res.ok });
      fetchPlans();
    } catch {
      setStatus({ msg: "Failed to delete exercise", ok: false });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Workout Plans</h2>

      {/* Create Plan */}
      <form onSubmit={handleCreatePlan} className="space-y-4 mb-6">
        <input
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder="Plan Name"
          className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
        />
        <button
          disabled={!planName.trim()}
          className="bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Create Plan
        </button>
      </form>

      {status && (
        <p
          className={`text-sm mb-4 ${
            status.ok ? "text-green-600" : "text-red-600"
          }`}
        >
          {status.msg}
        </p>
      )}

      {loading && <p className="text-sm text-gray-500">Loading plans…</p>}

      {/* Plans List */}
      <ul className="space-y-4">
        {plans.map((plan) => (
          <li
            key={plan._id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">{plan.name}</p>
              <button
                onClick={() => handleDeletePlan(plan._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete Plan
              </button>
            </div>

            {/* Exercises */}
            <ul className="ml-4 space-y-1">
              {plan.exercises?.map((ex) => (
                <li
                  key={ex._id}
                  className="flex justify-between items-center text-sm"
                >
                  <span>
                    {ex.name} — {ex.sets} sets × {ex.reps} reps
                  </span>
                  <button
                    onClick={() => handleDeleteExercise(plan._id, ex._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
              {(!plan.exercises || plan.exercises.length === 0) && (
                <li className="text-xs text-gray-500">No exercises yet</li>
              )}
            </ul>

            {/* Add Exercise Form */}
            <ExerciseForm
              planId={plan._id}
              onAdded={(msg, ok) => {
                setStatus({ msg, ok });
                fetchPlans();
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
