import React, { useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import ReservationsPage from "./pages/Reservation/Reservation";
import EventPage from "./pages/Event/Events";
import MoviePage from "./pages/Movie/Movies";
import SeatsPage from "./pages/Seat/Seats";
import ReportsPage from "./pages/Report/Reports";
import Home from "./pages/Home/Home";
import SettingsPage from "./pages/Setting/Setting";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import ShowsPage from "./pages/Show/Show";

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
          {/* <Header OpenSidebar={OpenSidebar} /> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/eventspage" element={<EventPage />} />
            <Route path="/moviespage" element={<MoviePage />} />
            <Route path="/seatpage" element={<ShowsPage />} />
            <Route path="/moviespage/showpage" element={<ShowsPage />} />
            <Route
              path="/moviespage/showpage/seatpage/:id"
              exact
              element={<SeatsPage />}
            />
            <Route path="/reservationspage" element={<ReservationsPage />} />
            <Route path="/reportspage" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
