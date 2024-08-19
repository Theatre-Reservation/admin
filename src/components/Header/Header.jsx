import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Admin Dashboard</h1>
      </div>
      <nav className="nav-links">
        <ul>
          <li>Home</li>
          <li>Reservations</li>
          <li>Shows</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </nav>
      <div className="menu-icon">
        <span>&#9776;</span>
      </div>
    </header>
  );
};

export default Header;
