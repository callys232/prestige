import { useState, useEffect } from "react";

export default function WorkoutManager() {
  const [plans, setPlans] = useState([]);
  const [planName, setPlanName] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const res = await fetch("/api/admin/workout-plans");
    const data = await res.json();
    setPlans(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
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

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/delete-workout?id=${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    setStatus(result.message);
    fetchPlans();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Workout Plans</h2>

      <form onSubmit={handleCreate} className="space-y-4 mb-6">
        <input
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder="Plan Name"
          className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded-md">
          Create Plan
        </button>
      </form>

      {status && <p className="text-sm text-green-600 mb-4">{status}</p>}

      <ul className="space-y-2">
        {plans.map((plan) => (
          <li
            key={plan.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
          >
            <p className="font-semibold">{plan.name}</p>
            <button
              onClick={() => handleDelete(plan.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
