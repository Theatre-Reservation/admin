import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/Home";
import ReservationsPage from "./pages/Reservation/Reservation";
import ShowsPage from "./pages/Show/Shows";
import SeatsPage from "./pages/Seat/Seats";
import ReportsPage from "./pages/Report/Reports";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Router>
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        <div
          className={
            openSidebarToggle ? "main-content expanded" : "main-content"
          }
        >
          <Header OpenSidebar={OpenSidebar} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reportspage" element={<ReportsPage />} />
            <Route path="/seatpage" element={<SeatsPage />} />
            <Route path="/showspage" element={<ShowsPage />} />
            <Route path="/reservationspage" element={<ReservationsPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
