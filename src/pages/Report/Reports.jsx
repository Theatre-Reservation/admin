import React, { useState, useContext, useEffect } from "react";
import axios from "../../axios";
import "./Reports.css";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../../components/Spinner/Spinner";

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
  const [popularMovie, setpopularMovie] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoding] = useState(false);
  const [download, setDownload] = useState(false);

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
    // setLoding(true);
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
          setpopularMovie(formatPopularMovies(response.data));
        } catch (error) {
          console.error("Error fetching shows:", error);
        } finally {
          setLoding(false);
        }
      }
    };

    fetchData();
  }, [user, period, loading]);
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

  const formatPopularMovies = (data) => {
    let total = 0;
    const popularMovies = data.map((item) => {
      total += item["Total Bookings"];
      return {
        movie: item.Movie,
        booking: item["Total Bookings"],
      };
    });
    console.log("popularMovies", popularMovies);
    console.log("total", total);
    return {
      totalBookings: total,
      popularMovies,
    };
  };

  const getReportData = (type, time) => {
    switch (type) {
      case "sales":
        const salesReport = {
          title: <strong>Sales Report ({time})</strong>, // Bold heading using JSX
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
                    {item.movie}: Rs. {round(item.revenue, 3)}
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
            <>
              <strong style={{ fontSize: "1.2em", color: "#333" }}>
                Total booking: {popularMovie.totalBookings}
              </strong>
              <ul style={{ fontSize: "1em", color: "#555" }}>
                {popularMovie.popularMovies.map((item, index) => (
                  <li key={index}>
                    {item.movie}: {item.booking} bookings
                  </li>
                ))}
              </ul>
            </>
          ),
        };
        return popularShowsReport;
    }
  };

  // Function to generate report based on type and time period
  const generateReport = () => {
    const time = timePeriod;
    setLoding(true);
    const showData = getReportData(reportType, time);
    setReportData(showData);
  };

  const downloadReport = (
    time,
    dashboardData,
    reportType,
    revenueData,
    popularMovie
  ) => {
    console.log("Downloading report...111111111111111111");
    import("jspdf").then((jsPDF) => {
      const doc = new jsPDF.default();

      let reportTitle = "";
      let reportContent = "";

      switch (reportType) {
        case "sales":
          reportTitle = `Sales Report (${time})`;
          if (dashboardData.length > 0) {
            dashboardData.forEach((item) => {
              reportContent += `
                ${new Date(item.month + " 1, 2024").toLocaleString("default", {
                  month: "long",
                })}
                • Revenue: Rs. ${item.revenue * 1000}
                • Total Bookings: ${item.totalBookings}
                • Total Users: ${item.totalUsers}\n\n`;
            });
          } else {
            reportContent = "No sales data available.";
          }
          break;

        case "revenue":
          reportTitle = `Revenue Report (${time})`;
          if (revenueData.movieRevenues) {
            reportContent += `Total revenue: Rs. ${round(
              revenueData.totalRevenue,
              3
            )}\n\n`;
            revenueData.movieRevenues.forEach((item) => {
              reportContent += `• ${item.movie}: Rs. ${round(
                item.revenue,
                3
              )}\n`;
            });
          } else {
            reportContent = "No revenue data available.";
          }
          break;

        case "popular-shows":
          reportTitle = `Popular Shows Report (${time})`;
          if (popularMovie.popularMovies) {
            reportContent += `Total bookings: ${popularMovie.totalBookings}\n\n`;
            popularMovie.popularMovies.forEach((item) => {
              reportContent += `• ${item.movie}: ${item.booking} bookings\n`;
            });
          } else {
            reportContent = "No popular shows data available.";
          }
          break;

        default:
          reportTitle = "Unknown Report";
          reportContent = "No data available for this report type.";
          break;
      }

      // Set the title of the report at the top
      doc.setFontSize(18);
      doc.text(reportTitle, 10, 10);

      // Set the content of the report below the title
      doc.setFontSize(12);
      const wrappedContent = doc.splitTextToSize(reportContent, 180);
      doc.text(wrappedContent, 10, 20);

      // Save the generated PDF
      doc.save(`${reportTitle}.pdf`);
      setDownload(false);
    });
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
            onChange={(e) => {
              setReportType(e.target.value), setLoding(false);
            }}
          >
            <option value="sales">Sales</option>
            <option value="revenue">Revenue</option>
            <option value="popular-shows">Popular Shows</option>
          </select>
        </div>
      </div>

      {/* Button to generate the report */}
      <button
        onClick={generateReport}
        disabled={loading}
        className="generate-btn"
      >
        Generate Report
      </button>

      {/* Displaying the generated report */}
      {reportData && (
        <div className="report-result">
          <h2>{reportData.title}</h2>
          <pre>{loading ? <Spinner size="30px" /> : reportData.data}</pre>
          <button
            onClick={() => {
              downloadReport(
                timePeriod,
                dashboardData,
                reportType,
                revenueData,
                popularMovie
              );
              setDownload(true);
            }}
            className="download-btn"
          >
            {download ? <Spinner size="15px" /> : "Download Report"}
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
