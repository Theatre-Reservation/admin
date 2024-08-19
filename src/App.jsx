import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import ReservationsPage from "./pages/Reservation/Reservation";
import ShowsPage from "./pages/Show/Shows";
import SeatsPage from "./pages/Seat/Seats";
import ReportsPage from "./pages/Report/Reports";
// import Reports from "./components/Reports/Reports";

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      {/* <Sidebar /> */}
      <ReportsPage />
      {/* <SeatsPage /> */}
      {/* <ShowsPage /> */}
      {/* <ReservationsPage /> */}
      {/* <Reports /> */}
      {/* <Header OpenSidebar={OpenSidebar} /> */}
      {/* <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <Home /> */}
    </div>
  );
}

export default App;
