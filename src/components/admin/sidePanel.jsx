const sections = ["User Management", "Workout Plans", "Work Activities"];

export default function Sidebar({ active, onSelect }) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section}>
            <button
              onClick={() => onSelect(section)}
              className={`w-full text-left px-4 py-2 rounded-md ${
                active === section
                  ? "bg-prestigeTeal text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {section}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
