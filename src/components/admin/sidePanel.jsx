import {
  UserIcon,
  ClipboardListIcon,
  BriefcaseIcon,
  ChartBarIcon,
  BellIcon,
} from "@heroicons/react/outline";

const sections = [
  { label: "User Management", Icon: UserIcon },
  { label: "Workout Plans", Icon: ClipboardListIcon },
  { label: "Work Activities", Icon: BriefcaseIcon },
  { label: "Analytics", Icon: ChartBarIcon },
  { label: "Notifications", Icon: BellIcon },
];

export default function Sidebar({ active, onSelect }) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-4 shadow-xl rounded-r-xl transition-all duration-300 ease-in-out">
      <h2
        className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 
             bg-clip-text text-transparent transition-all duration-300 
             hover:scale-105 hover:from-indigo-500 hover:to-pink-500 cursor-pointer"
      >
        Admin Panel
      </h2>

      <ul className="space-y-3">
        {sections.map(({ label, Icon }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => onSelect(label)}
              aria-current={active === label ? "page" : undefined}
              className={`w-full flex items-center px-4 py-2 rounded-md transition-all duration-200 ease-in-out transform ${
                active === label
                  ? "bg-blue-400 text-white border-l-4 border-blue-400 scale-[1.02] shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-[1.01]"
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
