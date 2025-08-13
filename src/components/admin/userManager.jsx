import { useState, useEffect } from "react";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    setStatus(result.message);
    setFormData({ username: "", password: "" });
    fetchUsers();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <form onSubmit={handleCreate} className="space-y-4 mb-6">
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Add User
        </button>
      </form>

      {status && <p className="text-sm text-green-600 mb-4">{status}</p>}

      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow"
          >
            <p className="font-semibold">{user.username}</p>
            {/* Add edit/delete buttons here */}
          </li>
        ))}
      </ul>
    </div>
  );
}
