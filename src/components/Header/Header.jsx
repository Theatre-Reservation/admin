import React from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from "react-icons/bs";
import "./Header.css";

function Header({ OpenSidebar }) {
  return (
    <header className="header">
      <div className="header-search">
        <BsSearch className="icon" />
        <input type="text" placeholder="Search" />
      </div>
      <div className="header-icons">
        <BsFillBellFill className="icon" />
        <BsFillEnvelopeFill className="icon" />
        <BsPersonCircle className="icon" />
      </div>
      <BsJustify className="icon menu" onClick={OpenSidebar} />
    </header>
  );
}

export default Header;
