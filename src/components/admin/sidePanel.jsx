const Sidebar = ({ active, onSelect }) => {
  const menuItems = [
    "User Management",
    "Trainer Management",
    "Bookings & Attendance",
    "Analytics & Reports",
    "Notification & Messaging",
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-5">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item}
            className={`mb-4 cursor-pointer ${
              active === item ? "text-orange-500 font-semibold" : "hover:text-orange-400"
            }`}
            onClick={() => onSelect(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
