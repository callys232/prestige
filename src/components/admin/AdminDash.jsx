import { useState } from "react";
import Sidebar from "./Sidebar";
import UserForm from "./UserForm";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("User Management");

  return (
    <div className="flex">
      <Sidebar active={selectedSection} onSelect={setSelectedSection} />
      <div className="flex-1 p-6">
        <UserForm section={selectedSection} />
      </div>
    </div>
  );
};

export default AdminDashboard;
