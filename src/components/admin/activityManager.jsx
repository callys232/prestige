"use client";
import { useEffect, useState } from "react";
import UserForm from "./userForm"; // import your existing form

export default function ActivityManager() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setStatus("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users?status=suspended");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setStatus("Failed to load users");
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await fetch("/api/admin/reactivate-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      fetchStats();
      fetchUsers();
    } catch {
      setStatus("Failed to reactivate user");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await fetch(`/api/admin/delete-user?userId=${userId}`, {
        method: "DELETE",
      });
      fetchStats();
      fetchUsers();
    } catch {
      setStatus("Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      {/* Heading with Add User button */}
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold text-blue-600 dark:text-blue-400
                     transition-all duration-300 ease-in-out
                     hover:scale-105 hover:text-blue-700 dark:hover:text-blue-300
                     hover:drop-shadow-md cursor-pointer"
        >
          Activity Manager
        </h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
          onClick={() => setShowUserForm(true)}
        >
          + Add User
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading stats...</p>}
      {status && <p className="text-red-500">{status}</p>}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Registered Users"
            value={stats.totalUsers}
            color="blue"
          />
          <StatCard
            label="Active Members"
            value={stats.activeMembers}
            color="green"
          />
          <StatCard
            label="Expiring Soon"
            value={stats.expiringSoon}
            color="yellow"
          />
          <StatCard
            label="Total Trainers"
            value={stats.totalTrainers}
            color="indigo"
          />
          <StatCard
            label="Suspended Accounts"
            value={stats.suspended}
            color="red"
          />
          <StatCard
            label="Inactive 30+ Days"
            value={stats.inactive30Days}
            color="orange"
          />
          <StatCard
            label="Expired Accounts"
            value={stats.expired}
            color="gray"
          />
        </div>
      )}

      {/* Actions list */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Account Actions</h3>
        <ul className="space-y-2">
          {users.length === 0 && (
            <li className="text-sm text-gray-500">No suspended users</li>
          )}
          {users.map((user) => (
            <li key={user._id} className="flex justify-between items-center">
              <span className="text-sm">{user.username}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleReactivate(user._id)}
                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition"
                >
                  Reactivate
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for UserForm */}
      {showUserForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Create New User
              </h3>
              <button
                onClick={() => setShowUserForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <UserForm
              onSuccess={() => {
                setShowUserForm(false);
                fetchStats();
                fetchUsers();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    yellow: "border-yellow-500",
    indigo: "border-indigo-500",
    red: "border-red-500",
    orange: "border-orange-500",
    gray: "border-gray-500",
  };

  return (
    <div
      className={`p-4 rounded shadow text-center border-t-4 
                  bg-white dark:bg-gray-800 ${colorClasses[color]}`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">
        {value}
      </p>
    </div>
  );
}
