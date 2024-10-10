import React from "react";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsFillGearFill,
} from "react-icons/bs";

import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <>
      {!openSidebarToggle && (
        <aside
          id="sidebar"
          className={openSidebarToggle ? "sidebar-responsive" : ""}
        >
          <div className="sidebar-title">
            <div className="sidebar-brand">
              {/* <BsCart3 className="icon" /> */}
              <h1>Flash Ticket</h1>
            </div>
            <span className="icon close_icon" onClick={OpenSidebar}>
              X
            </span>
          </div>

          <ul className="sidebar-list">
            <li className="sidebar-list-item">
              <Link to="/home">
                <BsGrid1X2Fill className="icon" /> Dashboard
              </Link>
            </li>
            {/* <li className="sidebar-list-item">
              <Link to="/seatpage">
              <BsFillGrid3X3GapFill className="icon" /> Seats
              </Link>
              </li> */}
            <li className="sidebar-list-item">
              <Link to="/movies">
                <BsPeopleFill className="icon" /> Movies
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/events">
                <BsPeopleFill className="icon" /> Events
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/reservations">
                <BsListCheck className="icon" /> Reservations
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/reportspage">
                <BsFillArchiveFill className="icon" /> Reports
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/settings">
                <BsFillGearFill className="icon" /> Settings
              </Link>
            </li>
            <li className="sidebar-log-out">
              <Link to="/">
                <p>Log out</p>
              </Link>
            </li>
          </ul>
        </aside>
      )}
    </>
  );
}

export default Sidebar;
