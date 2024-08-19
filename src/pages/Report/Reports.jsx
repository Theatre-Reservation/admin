import React, { useState } from "react";
import { saveAs } from "file-saver";
import "./Reports.css";
// import { ReportData } from "./ReportData";

function ReportsPage() {
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [reportType, setReportType] = useState("sales");
  const [reportData, setReportData] = useState(null);

  // Dummy data for demonstration
  const dummyReports = {
    sales: {
      weekly: {
        title: "Weekly Sales Report",
        data: "Sales data for the week...",
      },
      monthly: {
        title: "Monthly Sales Report",
        data: "Sales data for the month...",
      },
      yearly: {
        title: "Yearly Sales Report",
        data: "Sales data for the year...",
      },
    },
    revenue: {
      weekly: {
        title: "Weekly Revenue Report",
        data: "Revenue data for the week...",
      },
      monthly: {
        title: "Monthly Revenue Report",
        data: "Revenue data for the month...",
      },
      yearly: {
        title: "Yearly Revenue Report",
        data: "Revenue data for the year...",
      },
    },
    popular: {
      weekly: {
        title: "Weekly Popular Shows Report",
        data: "Popular shows for the week...",
      },
      monthly: {
        title: "Monthly Popular Shows Report",
        data: "Popular shows for the month...",
      },
      yearly: {
        title: "Yearly Popular Shows Report",
        data: "Popular shows for the year...",
      },
    },
  };

  const generateReport = () => {
    const data = dummyReports[reportType][timePeriod];
    setReportData(data);
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
            <option value="popular">Popular Shows</option>
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
