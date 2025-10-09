"use client";
import { useState, useEffect } from "react";

export default function WorkoutManager() {
  const [plans, setPlans] = useState([]);
  const [planName, setPlanName] = useState("");
  const [status, setStatus] = useState(null);

  // exercise form state
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseReps, setExerciseReps] = useState("");
  const [exerciseSets, setExerciseSets] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/admin/workout-plans");
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      setStatus("Failed to load plans");
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!planName.trim()) return;
    const res = await fetch("/api/admin/create-workout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: planName }),
    });
    const result = await res.json();
    setStatus(result.message);
    setPlanName("");
    fetchPlans();
  };

  const handleDeletePlan = async (id) => {
    const res = await fetch(`/api/admin/delete-workout?id=${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    setStatus(result.message);
    fetchPlans();
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;
    const res = await fetch(`/api/admin/add-exercise?planId=${selectedPlan}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: exerciseName,
        reps: exerciseReps,
        sets: exerciseSets,
      }),
    });
    const result = await res.json();
    setStatus(result.message);
    setExerciseName("");
    setExerciseReps("");
    setExerciseSets("");
    fetchPlans();
  };

  const handleDeleteExercise = async (planId, exerciseId) => {
    const res = await fetch(
      `/api/admin/delete-exercise?planId=${planId}&exerciseId=${exerciseId}`,
      { method: "DELETE" }
    );
    const result = await res.json();
    setStatus(result.message);
    fetchPlans();
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

      {status && <p className="text-sm text-green-600 mb-4">{status}</p>}

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
            <form
              onSubmit={handleAddExercise}
              className="mt-3 flex gap-2 items-center"
            >
              <input
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Exercise"
                className="px-2 py-1 border rounded text-sm"
              />
              <input
                value={exerciseSets}
                onChange={(e) => setExerciseSets(e.target.value)}
                placeholder="Sets"
                className="w-16 px-2 py-1 border rounded text-sm"
              />
              <input
                value={exerciseReps}
                onChange={(e) => setExerciseReps(e.target.value)}
                placeholder="Reps"
                className="w-16 px-2 py-1 border rounded text-sm"
              />
              <button
                type="submit"
                onClick={() => setSelectedPlan(plan._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Add
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
