const UserForm = ({ section }) => {
  return (
    <div className="bg-white shadow-lg p-6 rounded">
      <h2 className="text-xl font-bold mb-4 text-gray-700">{section}</h2>

      {section === "User Management" && (
        <div>
          {/* Render user form fields and action buttons here */}
          <input placeholder="User Name" className="input" />
          {/* ...other fields */}
          <button className="btn bg-blue-500 text-white">Add User</button>
        </div>
      )}

      {section === "Trainer Management" && (
        <div>
          {/* Render trainer-specific form */}
          <input placeholder="Trainer Name" className="input" />
          <button className="btn bg-green-500 text-white">Add Trainer</button>
        </div>
      )}

      {section === "Bookings & Attendance" && (
        <div>
          <p className="text-sm text-gray-600">
            Booking module coming soon...
          </p>
        </div>
      )}

      {/* Add more conditions as needed */}
    </div>
  );
};

export default UserForm;
