import Link from "next/link";

export default function AdminDashboard() {
  const sections = [
    {
      name: "Users",
      path: "/admin/users",
      color: "bg-blue-500",
      description: "Create, edit, and manage user accounts",
    },
    {
      name: "Workout Plans",
      path: "/admin/workouts",
      color: "bg-green-500",
      description: "Design and assign workout programs",
    },
    {
      name: "Activities",
      path: "/admin/activities",
      color: "bg-purple-500",
      description: "Define and organize workout activities",
    },
    {
      name: "Trainers",
      path: "/admin/trainers",
      color: "bg-yellow-500",
      description: "Manage trainer profiles and assignments",
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      color: "bg-red-500",
      description: "Track attendance and session bookings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.name}
            href={section.path}
            className={`p-6 rounded-lg shadow hover:shadow-xl transition text-white ${section.color}`}
          >
            <h2 className="text-xl font-semibold mb-2">{section.name}</h2>
            <p className="text-sm">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
