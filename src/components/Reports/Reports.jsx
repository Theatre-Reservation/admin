import React, { useState, useEffect } from "react";
import "./Reports.css";

const Reports = () => {
  const [reportType, setReportType] = useState("sales");
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    // Fetch report data based on selected report type
    fetchReportData();
  }, [reportType]);

  const fetchReportData = async () => {
    // Simulate fetching data from an API
    const data = await fetch(`/api/reports?type=${reportType}`).then((res) =>
      res.json()
    );
    setReportData(data);
  };

  const renderReport = () => {
    switch (reportType) {
      case "sales":
        return renderSalesReport();
      case "best-movies":
        return renderBestMoviesReport();
      default:
        return <p>No report available.</p>;
    }
  };

  const renderSalesReport = () => {
    return (
      <div className="report">
        <h3>Sales Report</h3>
        <ul>
          {reportData.map((item, index) => (
            <li key={index}>
              {item.date}: ${item.sales}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderBestMoviesReport = () => {
    return (
      <div className="report">
        <h3>Best Movies Report</h3>
        <ul>
          {reportData.map((movie, index) => (
            <li key={index}>
              {movie.title} - {movie.ticketsSold} tickets sold
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="reports">
      <h2>Generate Reports</h2>
      <div className="report-options">
        <button onClick={() => setReportType("sales")}>Sales Report</button>
        <button onClick={() => setReportType("best-movies")}>
          Best Movies Report
        </button>
        {/* Add more buttons for other report types */}
      </div>
      <div className="report-content">{renderReport()}</div>
    </div>
  );
};

export default Reports;
