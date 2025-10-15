"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, loginType: "admin" }),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Invalid credentials");

      router.push("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              required
              className="w-full px-4 py-2 bg-gray-700 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
              className="w-full px-4 py-2 bg-gray-700 rounded-md"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-prestigeTeal text-white py-2 rounded-md hover:bg-teal-600 transition disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Expectations from server:
 * GET  /api/me            -> { username, role, profileUrl, accountStatus, workoutType, classesBooked, classesAttended, classesThisMonth }
 * POST /api/update-account -> accepts { username?, password?, workoutType?, profileUrl? } and enforces role-based permission server-side
 * POST /api/upload-profile -> multipart file upload returns { url }
 * POST /api/logout        -> invalidates session
 *
 * Server must authenticate requests (cookie or Authorization header) and validate roles.
 */

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null); // holds full user object from /api/me
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // edit fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [workoutType, setWorkoutType] = useState("Strength");
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);

  // class stats
  const [classesStats, setClassesStats] = useState({ booked: 0, attended: 0, month: 0 });

  // Fetch current user on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to load user");
        const data = await res.json();
        if (!mounted) return;
        setUser(data);
        setUsername(data.username || "");
        setWorkoutType(data.workoutType || "Strength");
        setProfilePreview(data.profileUrl || null);
        setClassesStats({
          booked: Number(data.classesBooked) || 0,
          attended: Number(data.classesAttended) || 0,
          month: Number(data.classesThisMonth) || 0,
        });
      } catch (err) {
        console.error(err);
        // fallback: redirect to login
        router.push("/login");
      }
    }
    load();
    return () => (mounted = false);
  }, [router]);

  // Helpers
  function handleProfileSelect(file) {
    if (!file) return;
    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setProfilePreview(e.target.result);
    reader.readAsDataURL(file);
  }

  async function uploadProfile() {
    if (!profileFile) return null;
    const form = new FormData();
    form.append("file", profileFile);
    const res = await fetch("/api/upload-profile", { method: "POST", body: form, credentials: "include" });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  }

  // Role-based check helpers
  function canEdit() {
    // example policy: allow admins and members
    const role = user?.role ?? "guest";
    return role === "admin" || role === "member";
  }

  // Submit updates
  async function handleUpdate(e) {
    e.preventDefault();
    setStatus(null);

    if (!canEdit()) {
      setStatus({ success: false, message: "You don't have permission to update this account." });
      return;
    }

    if (password && password.length > 0 && password.length < 8) {
      setStatus({ success: false, message: "Password must be at least 8 characters." });
      return;
    }

    setLoading(true);
    try {
      const uploadedUrl = await (profileFile ? uploadProfile() : Promise.resolve(null));

      const payload = {
        ...(username ? { username } : {}),
        ...(password ? { password } : {}),
        ...(uploadedUrl ? { profileUrl: uploadedUrl } : {}),
        workoutType,
      };

      const res = await fetch("/api/update-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.status === 403) {
        setStatus({ success: false, message: "Not authorized to perform this action." });
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setUser(updated);
      setEditing(false);
      setPassword("");
      setProfileFile(null);
      setProfilePreview(updated.profileUrl ?? profilePreview);
      setStatus({ success: true, message: "Account updated successfully." });
    } catch (err) {
      console.error(err);
      setStatus({ success: false, message: "Update failed. Try again later." });
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } catch {}
    router.push("/login");
  };

  // Render loading state while user loads
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white py-10 px-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-lg font-bold text-white overflow-hidden">
          {profilePreview ? (
            <Image src={profilePreview} alt="Profile" width={64} height={64} className="object-cover" />
          ) : (
            <span aria-hidden>👤</span>
          )}
        </div>

        <div className="relative inline-block text-left overflow-hidden">
          <h1 className="relative z-10 text-2xl font-extrabold uppercase">
            Welcome back, {user.username.toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500">Role: <span className="font-semibold">{user.role}</span></p>
        </div>
      </div>

      {/* Account & Membership */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-lg font-medium">
            Membership Status: <span className={`${user.accountStatus === "Active" ? "text-green-600 dark:text-green-400" : "text-yellow-500"} font-semibold`}>{user.accountStatus}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Renewal Date: <span className="font-semibold">November 30th, 2025</span></p>
        </div>

        <div className="flex flex-col md:items-end">
          <label className="text-sm text-gray-600 dark:text-gray-400">Preferred Workout Type</label>
          <select value={workoutType} onChange={(e) => setWorkoutType(e.target.value)} className="mt-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800">
            <option>Strength</option>
            <option>Flexibility</option>
            <option>Endurance</option>
            <option>Cardio</option>
            <option>Mixed</option>
          </select>
        </div>
      </div>

      {/* Editable Profile */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => { setEditing((s) => !s); setStatus(null); }} className="text-sm text-blue-600 dark:text-blue-400 hover:underline" disabled={!canEdit()}>
            {editing ? "Cancel Edit" : "Edit Profile"}
          </button>

          <div className="text-sm text-gray-500">Classes this month: <span className="font-semibold">{classesStats.month}</span></div>
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-md" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-md" placeholder="Leave blank to keep current password" />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters to change password.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Upload Profile Picture</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md border">
                  <input type="file" accept="image/*" onChange={(e) => handleProfileSelect(e.target.files?.[0])} className="hidden" />
                  <span className="text-sm">Choose file</span>
                </label>
                {profilePreview && <div className="w-14 h-14 rounded-md overflow-hidden border"><Image src={profilePreview} alt="preview" width={56} height={56} /></div>}
                {profileFile && <button type="button" onClick={() => { setProfileFile(null); setProfilePreview(user.profileUrl || null); }} className="text-sm text-red-600">Remove</button>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading} className="bg-prestigeTeal text-white px-4 py-2 rounded-md hover:bg-teal-700 transition disabled:opacity-60">
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" onClick={() => { setEditing(false); setPassword(""); setStatus(null); setProfilePreview(user.profileUrl || null); }} className="px-4 py-2 rounded-md border">Cancel</button>
            </div>

            {status && <p aria-live="polite" className={`text-sm mt-2 ${status.success ? "text-green-600" : "text-red-600"}`}>{status.message}</p>}
          </form>
        ) : (
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p><span className="font-semibold">Username:</span> {user.username}</p>
            <p className="mt-1"><span className="font-semibold">Preferred workout:</span> {user.workoutType || workoutType}</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <div className="bg-prestigeTeal text-white p-4 rounded-xl shadow-md">
            <p className="text-sm font-medium mb-2">Classes Booked</p>
            <div className="text-2xl font-bold">{classesStats.booked}</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <div className="bg-prestigeTeal text-white p-4 rounded-xl shadow-md">
            <p className="text-sm font-medium mb-2">Classes Attended</p>
            <div className="text-2xl font-bold">{classesStats.attended}</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <div className="bg-prestigeTeal text-white p-4 rounded-xl shadow-md">
            <p className="text-sm font-medium mb-2">This Month</p>
            <div className="text-2xl font-bold">{classesStats.month}</div>
          </div>
        </motion.div>
      </div>

      {/* Help & Logout */}
      <div className="mt-6 flex justify-between items-center">
        <Link href="/contact" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Need Help?</Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Account: <span className="font-semibold">{user.accountStatus}</span></span>
          <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
        </div>
      </div>
    </div>

  );
}
