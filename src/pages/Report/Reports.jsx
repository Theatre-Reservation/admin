import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import "./Reports.css";
import axios from "../../axios";

function ReportsPage() {
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [reportType, setReportType] = useState("sales");
  const [reportData, setReportData] = useState(null);

  // Generate a time period based on the selected type (weekly, monthly, yearly) 
  // suitable for the API request (backend admin server)
  const generateTimePeriod = (type) => {
    const today = new Date();
    let start, end;

    if (type === "weekly") {
      const dayOfWeek = today.getDay();
      start = new Date(today);
      start.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Start of the week (Monday)
      end = new Date(start);
      end.setDate(start.getDate() + 6); // End of the week (Sunday)
    } else if (type === "monthly") {
      start = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month
    } else if (type === "yearly") {
      start = new Date(today.getFullYear(), 0, 1); // First day of the year
      end = new Date(today.getFullYear(), 11, 31); // Last day of the year
    } else {
      console.error("Invalid type provided");
      return; // Exit the function early if the type is invalid
    }

    // Safeguard: Check if start and end are valid dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error("Invalid date range generated");
      return; // Exit the function if the dates are not valid
    }

    const formattedStart = start.toISOString().split("T")[0];
    const formattedEnd = end.toISOString().split("T")[0];
    return `start=${formattedStart}&end=${formattedEnd}`;
  };

  const generateReport = () => {
    const time = generateTimePeriod(timePeriod);
    axios
      .get(
        `/report/${reportType}?${time}`
      )
      .then((response) => {
        console.log(response.data);
        setReportData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const downloadReport = () => {
    if (reportData) {
      const blob = new Blob([reportData.data], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, `${reportData.title}.txt`);
    }
  };

  return (
    <div className="reports-page">
      <h1>Generate Reports</h1>

      <div className="filters">
        <div className="filter">
          <label htmlFor="timePeriod">Time Period:</label>
          <select
            id="timePeriod"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="filter">
          <label htmlFor="reportType">Report Type:</label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="sales">Sales</option>
            <option value="revenue">Revenue</option>
            <option value="popular-shows">Popular Shows</option>
          </select>
        </div>
      </div>

      <button onClick={generateReport} className="generate-btn">
        Generate Report
      </button>

      {reportData && (
        <div className="report-result">
          <h2>{reportData.title}</h2>
          <p>{reportData.data}</p>
          <button onClick={downloadReport} className="download-btn">
            Download Report
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
