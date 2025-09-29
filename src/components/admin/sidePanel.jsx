import {
  UserIcon,
  ClipboardListIcon,
  BriefcaseIcon,
} from "@heroicons/react/outline";

const sections = [
  { label: "User Management", icon: <UserIcon className="w-5 h-5 mr-2" /> },
  {
    label: "Workout Plans",
    icon: <ClipboardListIcon className="w-5 h-5 mr-2" />,
  },
  {
    label: "Work Activities",
    icon: <BriefcaseIcon className="w-5 h-5 mr-2" />,
  },
];

export default function Sidebar({ active, onSelect }) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-4 shadow-xl rounded-r-xl transition-all duration-300 ease-in-out">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        Admin Panel
      </h2>
      <ul className="space-y-3">
        {sections.map(({ label, icon }) => (
          <li key={label}>
            <button
              onClick={() => onSelect(label)}
              className={`w-full flex items-center px-4 py-2 rounded-md transition-all duration-200 ease-in-out transform ${
                active === label
                  ? "bg-prestigeTeal text-white border-l-4 border-blue-500 scale-[1.02] shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-[1.01]"
              }`}
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
