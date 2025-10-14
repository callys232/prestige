"use client";
import { useState } from "react";
import Sidebar from "./sidePanel";
import UserForm from "./userForm";
import WorkoutForm from "./workoutManager";
import ActivityForm from "./activityManager";
import Analytics from "./Analytics";
import Notifications from "./notifications";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("User Management");

  const renderSection = () => {
    switch (selectedSection) {
      case "User Management":
        return <UserForm />;
      case "Workout Plans":
        return <WorkoutForm />;
      case "Work Activities":
        return <ActivityForm />;
      case "Analytics":
        return <Analytics />;
      case "Notifications":
        return <Notifications />;
      default:
        return <div>Select a section from the sidepanel</div>;
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Sidebar with logout */}
      <div className="w-64 bg-white dark:bg-gray-800 p-4 flex flex-col justify-between shadow-lg">
        <Sidebar active={selectedSection} onSelect={setSelectedSection} />
        <button
          onClick={handleLogout}
          className="mt-6 text-sm text-red-600 hover:underline self-start"
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">{renderSection()}</div>
    </div>
  );
};

export default AdminDashboard;
