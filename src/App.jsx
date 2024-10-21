import React, { useState } from "react";
// import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import ReservationsPage from "./pages/Reservation/Reservation";
import EventPage from "./pages/Event/Events";
import MoviePage from "./pages/Movie/Movies";
import SeatsPage from "./pages/Seat/Seats";
import ReportsPage from "./pages/Report/Reports";
import Home from "./pages/Home/Home";
import SettingsPage from "./pages/Setting/Setting";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import ShowsPage from "./pages/Show/Show";
import LoginPage from "./pages/Login/LoginPage";
import SignupPage from "./pages/Login/SignupPage";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Router>
        <AuthProvider>
          <LocationWrapper>
            {({ location }) => (
              <>
                {location.pathname !== "/" &&
                  location.pathname !== "/register" && (
                    <Sidebar
                      openSidebarToggle={openSidebarToggle}
                      OpenSidebar={OpenSidebar}
                    />
                  )}
                <div
                  className={
                    openSidebarToggle ? "main-content expanded" : "main-content"
                  }
                >
                  {/* <Header OpenSidebar={OpenSidebar} /> */}
                  <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<SignupPage />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/movies" element={<MoviePage />} />
                    <Route path="/events" element={<EventPage />} />
                    {/* <Route path="/seatpage" element={<ShowsPage />} /> */}
                    <Route path="/shows" element={<ShowsPage />} />
                    <Route
                      path="/shows/seats/:id"
                      exact
                      element={<SeatsPage />}
                    />
                    <Route
                      path="/reservations"
                      element={<ReservationsPage />}
                    />
                    <Route path="/reportspage" element={<ReportsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </div>
              </>
            )}
          </LocationWrapper>
        </AuthProvider>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Slide
      />
    </div>
  );

  function LocationWrapper({ children }) {
    const location = useLocation();
    return children({ location });
  }
}

export default App;
