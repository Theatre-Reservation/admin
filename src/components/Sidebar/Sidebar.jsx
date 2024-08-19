import React, { useState } from "react";
import "./Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "<<" : ">>"}
      </div>
      <ul className="sidebar-menu">
        <li>Home</li>
        <li>Reservations</li>
        <li>Shows</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </div>
  );
}

export default Sidebar;
