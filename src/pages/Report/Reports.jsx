import React, { useState, useContext, useEffect } from "react";
import axios from "../../axios";
import "./Reports.css";
import { AuthContext } from "../../context/AuthContext";

function ReportsPage() {
  const [timePeriod, setTimePeriod] = useState("yearly");
  const [reportType, setReportType] = useState("sales");
  const [reportData, setReportData] = useState(null);
  const [period, setPeriod] = useState({
    startDate: new Date(new Date().setMonth(0, 1)),
    endDate: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1, 0, 0)
    ),
  });

  const { user } = useContext(AuthContext); // Assuming the token is available in AuthContext
  const [revenueData, setRevenueData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [popularMovie, setpopularMovie] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);

  const changeTimePeriod = (e) => {
    setTimePeriod(e.target.value);

    const newPeriod = { ...period };

    if (e.target.value === "weekly") {
      newPeriod.startDate = new Date();
      newPeriod.startDate.setDate(newPeriod.startDate.getDate() - 7);
      newPeriod.endDate = new Date();
    } else if (e.target.value === "monthly") {
      newPeriod.startDate = new Date();
      newPeriod.startDate.setDate(1);
      newPeriod.endDate = new Date();
      newPeriod.endDate.setMonth(newPeriod.endDate.getMonth() + 1);
      newPeriod.endDate.setDate(0);
    } else if (e.target.value === "yearly") {
      newPeriod.startDate = new Date();
      newPeriod.startDate.setMonth(0, 1);
      newPeriod.endDate = new Date();
      newPeriod.endDate.setFullYear(newPeriod.endDate.getFullYear() + 1, 0, 0);
    }
    setPeriod(newPeriod);
    console.log(newPeriod);
  };

  useEffect(() => {
    // const period = { startDate: "2024-01-01", endDate: "2024-12-31" }; // Example period
    const fetchData = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("token"); // Get token from localStorage
          const theater = parseTheaterFromToken(token); // Extract theater from token
          console.log("Theater: ", theater);

          const response = await axios.get(`transactions/topMovies`, {
            params: {
              theater: theater, // Check if name has something
              startDate: period.startDate,
              endDate: period.endDate,
            },
            headers: { Authorization: `Bearer ${token}` },
          });
          const responseData = await axios.get(`transactions/monthly-data`, {
            params: {
              theater: theater, // Check if name has something
              startDate: period.startDate,
              endDate: period.endDate,
            },
          });
          setDashboardData(formatDashboardData(responseData.data));
          setRevenueData(formatRevenueData(response.data));
          setSalesData(formatSalesData(response.data));
          setpopularMovie(formatPopularMovies(response.data));
        } catch (error) {
          console.error("Error fetching shows:", error);
        }
      }
    };

    fetchData();
  }, [user, period]);
  console.log("dashboardData", dashboardData);

  const formatDashboardData = (data) => {
    return data.map((item) => {
      return {
        month: item.name,
        revenue: item.Revenue,
        totalBookings: item["Total Booking"],
        totalUsers: item["Total Customers"],
      };
    });
  };

  const formatRevenueData = (data) => {
    let total = 0;
    const movieRevenues = data.map((item) => {
      console.log(item);
      total += item["Total Revenue"]; // Sum total revenue
      return {
        movie: item.Movie,
        revenue: item["Total Revenue"] * 1000,
      };
    });

    return {
      totalRevenue: total * 1000,
      movieRevenues,
    };
  };

  const formatSalesData = (data) => {
    let total = 0;
    const movieSales = data.map((item) => {
      total += item["Total Bookings"];
      return {
        movie: item.Movie,
        sales: item["Total Bookings"],
      };
    });

    return {
      totalSales: total,
      movieSales,
    };
  };

  const formatPopularMovies = (data) => {
    return data.map((item) => {
      return {
        movie: item.Movie,
        booking: item["Total Bookings"],
      };
    });
  };

  const getReportData = (type, time) => {
    switch (type) {
      case "sales":
        const salesReport = {
          title: <strong>Sales (Booking) Report ({time})</strong>, // Bold heading using JSX
          data: (
            <>
              <ul style={{ fontSize: "1em", color: "#555" }}>
                {dashboardData.map((item, index) => (
                  <>
                    <strong style={{ fontSize: "1.2em", color: "#333" }}>
                      {new Date(item.month + " 1, 2024").toLocaleString(
                        "default",
                        { month: "long" }
                      )}
                    </strong>
                    <ul key={index}>
                      <li>Revenue: Rs. {item.revenue * 1000}</li>
                      <li>Total Bookings: {item.totalBookings}</li>
                      <li>Total Users: {item.totalUsers}</li>
                    </ul>
                  </>
                ))}
              </ul>
            </>
          ),
        };

        return salesReport;

      case "revenue":
        const revenueReport = {
          title: <strong>Revenue Report ({time})</strong>, // Bold heading using JSX
          data: (
            <>
              <strong style={{ fontSize: "1.2em", color: "#333" }}>
                Total revenue: Rs. {round(revenueData.totalRevenue, 3)}
              </strong>
              <ul style={{ fontSize: "1em", color: "#555" }}>
                {revenueData.movieRevenues.map((item, index) => (
                  <li key={index}>
                    {item.movie}: Rs. {item.revenue}
                  </li>
                ))}
              </ul>
            </>
          ),
        };
        return revenueReport;
      case "popular-shows":
        const popularShowsReport = {
          title: <strong>Popular Shows Report ({time})</strong>,
          data: (
            <ul style={{ fontSize: "1em", color: "#555" }}>
              {popularMovie.map((item, index) => (
                <li key={index}>
                  {item.movie}: {item.booking} bookings
                </li>
              ))}
            </ul>
          ),
        };
        return popularShowsReport;
    }
  };

  // Function to generate report based on type and time period
  const generateReport = () => {
    const time = timePeriod;
    const showData = getReportData(reportType, time);
    setReportData(showData);
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
            onChange={changeTimePeriod}
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

// Helper function to parse theater from token
const parseTheaterFromToken = (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
  return decodedToken.Name; // Assuming "theater" is a field in the token
};

// Helper function to round numbers to a specified number of decimal places
const round = (num, decimalPlaces) => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor, 2) / factor;
};

export default ReportsPage;
