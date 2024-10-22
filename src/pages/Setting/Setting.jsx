import React, { useState } from "react";
import "./Settings.css";
import { AuthContext } from "../../context/AuthContext";

function SettingsPage() {
  // State to manage settings options
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);
  const [emailFrequency, setEmailFrequency] = useState("daily");

  // Handler functions
  const handleThemeToggle = () => setDarkMode(!darkMode);
  const handleLanguageChange = (event) => setLanguage(event.target.value);
  const handleNotificationsToggle = () => setNotifications(!notifications);
  const handleEmailFrequencyChange = (event) =>
    setEmailFrequency(event.target.value);

  return (
    <div className="settings-page">
      <div className="main-content">
        <div className="settings-content">
          <h1>Admin Settings</h1>
          <div className="settings-options">
            {/* Theme Toggle */}
            <div className="option">
              <label htmlFor="themeToggle">Dark Mode:</label>
              <input
                type="checkbox"
                id="themeToggle"
                checked={darkMode}
                onChange={handleThemeToggle}
              />
            </div>

            {/* Language Selector */}
            <div className="option">
              <label htmlFor="languageSelect">Language:</label>
              <select
                id="languageSelect"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                {/* Add more language options as needed */}
              </select>
            </div>

            {/* Notification Toggle */}
            <div className="option">
              <label htmlFor="notificationsToggle">Enable Notifications:</label>
              <input
                type="checkbox"
                id="notificationsToggle"
                checked={notifications}
                onChange={handleNotificationsToggle}
              />
            </div>

            {/* Email Frequency Selector */}
            <div className="option">
              <label htmlFor="emailFrequency">
                Email Notifications Frequency:
              </label>
              <select
                id="emailFrequency"
                value={emailFrequency}
                onChange={handleEmailFrequencyChange}
              >
                <option value="instant">Instantly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* User Management */}
            <div className="option">
              <label>User Management:</label>
              <div>
                <button className="btn">Add User</button>
                <button className="btn">Remove User</button>
              </div>
            </div>

            {/* Data Export/Import */}
            <div className="option">
              <label>Data Management:</label>
              <div>
                <button className="btn">Export Data</button>
                <button className="btn">Import Data</button>
              </div>
            </div>

            {/* System Preferences */}
            <div className="option">
              <label>System Preferences:</label>
              <div>
                <button className="btn">Reset to Default</button>
                <button className="btn">Update System</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
