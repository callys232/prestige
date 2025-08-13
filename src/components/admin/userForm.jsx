import { useState } from "react";

const UserForm = ({ section }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    trainerName: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let endpoint = "";
      let payload = {};

      if (section === "User Management") {
        endpoint = "/api/admin/create-user";
        payload = {
          username: formData.username,
          password: formData.password,
        };
      } else if (section === "Trainer Management") {
        endpoint = "/api/admin/create-trainer";
        payload = {
          trainerName: formData.trainerName,
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus({ success: true, message: result.message || "Saved!" });
        setFormData({ username: "", password: "", trainerName: "" });
      } else {
        throw new Error(result.message || "Something went wrong.");
      }
    } catch (err) {
      setStatus({ success: false, message: err.message });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">
        {section}
      </h2>

      {section === "User Management" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
          />
          <button
            type="submit"
            className="btn bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add User
          </button>
        </form>
      )}

      {section === "Trainer Management" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="trainerName"
            value={formData.trainerName}
            onChange={handleChange}
            placeholder="Trainer Name"
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
          />
          <button
            type="submit"
            className="btn bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Add Trainer
          </button>
        </form>
      )}

      {section === "Bookings & Attendance" && (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Booking module coming soon...
          </p>
        </div>
      )}

      {status && (
        <p
          className={`mt-4 text-sm ${
            status.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
};

export default UserForm;
