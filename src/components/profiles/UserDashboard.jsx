"use client";

import { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  // Simulated user data (replace with real auth context or props)
  const [username, setUsername] = useState("lamidUser");
  const [password, setPassword] = useState("");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      // Replace with real API call
      await new Promise((res) => setTimeout(res, 1000));
      setEditing(false);
      setStatus({
        success: true,
        message: "Credentials updated successfully!",
      });
    } catch (error) {
      setStatus({ success: false, message: "Update failed. Try again." });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white py-10 px-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-lg font-bold text-white">
          👤
        </div>
        {/* Glitch Heading */}
        <div className="relative inline-block text-left overflow-hidden">
          <span className="absolute left-1 top-0 text-red-500 opacity-40 animate-glitch select-none pointer-events-none">
            WELCOME BACK, {username.toUpperCase()}
          </span>
          <span className="absolute left-0 top-1 text-blue-500 opacity-40 animate-glitch delay-150 select-none pointer-events-none">
            WELCOME BACK, {username.toUpperCase()}
          </span>
          <h1 className="relative z-10 text-2xl font-extrabold uppercase animate-glitch">
            WELCOME BACK, {username.toUpperCase()}
          </h1>
        </div>
      </div>

      {/* Membership Info */}
      <div className="mb-6">
        <p className="text-lg font-medium">
          Membership Status:{" "}
          <span className="text-green-600 dark:text-green-400 font-semibold">
            Active
          </span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Renewal Date:{" "}
          <span className="font-semibold">November 30th, 2025</span>
        </p>
      </div>

      {/* Editable Credentials */}
      <div className="mb-6">
        <button
          onClick={() => setEditing(!editing)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2"
        >
          {editing ? "Cancel Edit" : "Edit Username & Password"}
        </button>

        {editing && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-md"
              />
            </div>
            <button
              type="submit"
              className="bg-prestigeTeal text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
            >
              Save Changes
            </button>
            {status && (
              <p
                className={`text-sm mt-2 ${
                  status.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {status.message}
              </p>
            )}
          </form>
        )}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-prestigeTeal text-white p-4 rounded-xl shadow-md">
          <p className="text-sm font-medium mb-2">Strength Progress</p>
          <p className="text-sm text-white/90">Classes Attended</p>
          <div className="my-2 w-full bg-white/30 rounded-full h-3">
            <div className="bg-white h-3 rounded-full w-[43%]"></div>
          </div>
          <p className="text-right text-sm font-semibold">43%</p>
        </div>

        {/* Card 2 */}
        <div className="bg-prestigeTeal text-white p-4 rounded-xl shadow-md relative">
          <p className="text-sm font-medium mb-2">Flexibility Boost</p>
          <p className="text-sm text-white/90">Classes Attended</p>
          <div className="my-2 w-full bg-white/30 rounded-full h-3">
            <div className="bg-white h-3 rounded-full w-[43%]"></div>
          </div>
          <p className="text-right text-sm font-semibold mb-4">43%</p>
          <Link
            href="/book"
            className="block text-center bg-blue-400 text-prestigeTeal font-semibold rounded-md px-4 py-2 hover:bg-gray-100 transition"
          >
            BOOK CLASS
          </Link>
        </div>

        {/* Card 3 */}
        <div className="bg-prestigeTeal text-white p-4 rounded-xl shadow-md">
          <p className="text-sm font-medium mb-2">Endurance Focus</p>
          <p className="text-sm text-white/90">Classes Attended</p>
          <div className="my-2 w-full bg-white/30 rounded-full h-3">
            <div className="bg-white h-3 rounded-full w-[43%]"></div>
          </div>
          <p className="text-right text-sm font-semibold">43%</p>
        </div>
      </div>

      {/* Help Link */}
      <div className="mt-6">
        <Link
          href="/help"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Need Help?
        </Link>

        <button
          onClick={async () => {
            await fetch("/api/logout");
            window.location.href = "/login";
          }}
          className="text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
