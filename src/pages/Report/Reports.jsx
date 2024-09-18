import React, { useState } from "react";
import "./Reports.css";
import { getDummyReportData } from "./data"; // Import the dummy data function

function ReportsPage() {
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [reportType, setReportType] = useState("sales");
  const [reportData, setReportData] = useState(null);

  // Function to generate report based on type and time period
  const generateReport = () => {
    const time = timePeriod;
    const dummyData = getDummyReportData(reportType, time);
    setReportData(dummyData);
  };

  // Function to download the report
  const downloadReport = () => {
    if (reportData) {
      import("jspdf").then((jsPDF) => {
        const doc = new jsPDF.default();

        // Set the title of the report at the top
        doc.setFontSize(16);
        doc.text(reportData.title, 10, 10);

        // Add report content below the title
        doc.setFontSize(12);
        const reportContent = doc.splitTextToSize(reportData.data, 180); // Wrap long text
        doc.text(reportContent, 10, 20);

        // Save the generated PDF with the title as the filename
        doc.save(`${reportData.title}.pdf`);
      });
    }
  };

  return (
    <div className="reports-page">
      <h1>Generate Reports</h1>

      {/* Report Filters */}
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

      {/* Button to generate the report */}
      <button onClick={generateReport} className="generate-btn">
        Generate Report
      </button>

      {/* Displaying the generated report */}
      {reportData && (
        <div className="report-result">
          <h2>{reportData.title}</h2>
          <pre>{reportData.data}</pre>
          <button onClick={downloadReport} className="download-btn">
            Download Report
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
