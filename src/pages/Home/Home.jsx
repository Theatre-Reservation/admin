import React, { useEffect, useState } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import {
  BarChart,
  PieChart,
  Pie,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import "./Dashboard.css";
import Card from "../../components/Card/Card";
import axios from "../../axios";

function Dashboard() {
  const [totalshows, setTotalShows] = useState(0);
  const [name, setName] = useState("");
  // const [data, setData] = useState(false);
  const [movie, setMovie] = useState("");
  const [homeData, setHomeData] = useState({
    totalBookings: "0",
    totalRevenue: "0",
    totalUsers: "0",
  });
  const [pieData, setPieData] = useState([]);
  const [period, setPeriod] = useState({
    startDate: new Date(new Date().setMonth(0, 1)),
    endDate: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1, 0, 0)
    ),
  });
  const [timePeriod, setTimePeriod] = useState("yearly");
  const [error, setError] = useState(null);
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
  };

  // Fetch user profile when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      const newToken = localStorage.getItem("token");
      // console.log("Token: ", newToken);

      if (!newToken) {
        console.log("No token found. Please log in.");
        return;
      }
      try {
        const response = await axios.get(
          "https://auth-service1-bkdhfbh9a3a2g4ba.canadacentral-01.azurewebsites.net/api/v1/user-auth/profile",
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          }
        );
        // console.log(response.data);
        setName(response.data.Name);
        // if (response.data.Name === "Majestic City - Colombo") {
        //   setData(true);
        // } else {
        //   setData(false);
        // }
        setMovie(response.data.Name);
      } catch (err) {
        console.log("Failed to fetch user data");
      } finally {
        // setLoading(false); // Stop loading when request completes
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get(`transactions/revenue`, {
          params: {
            theater: name, // Check if name has something
            startDate: period.startDate,
            endDate: period.endDate,
          },
        });
        console.log("Response Data: ", response.data);
        if (response.data.length === 1) {
          setHomeData({
            totalBookings: response.data[0].totalBookings,
            totalRevenue: response.data[0].totalRevenue,
            totalUsers: response.data[0].totalUsers,
          });
        }
      } catch (err) {
        setError(err.message);
      }
    };
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`transactions/monthly-data`, {
          params: {
            theater: name, // Check if name has something
            startDate: period.startDate,
            endDate: period.endDate,
          },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    const pieData = async () => {
      try {
        const response = await axios.get(`transactions/topMovies`, {
          params: {
            theater: name, // Check if name has something
            startDate: period.startDate,
            endDate: period.endDate,
          },
        });
        console.log("pie Data: ", response.data);
        setPieData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };
    const fetchShows = async () => {
      try {
        console.log("ssss");
        console.log(name);
        console.log(period.startDate);
        const response = await axios.get(`shows/admin/theater`, {
          params: {
            theater: name,
            startDate: period.startDate,
            endDate: period.endDate,
          },
        });
        console.log("awawawa");
        console.log("Shows Data: ", response.data);
        console.log("Total Shows:ss ", startDate);
        setTotalShows(response.data.length);
      } catch (err) {
        setError(err.message);
        console.error(error);
      }
    };
    fetchHomeData();
    fetchDashboardData();
    fetchShows();
    pieData();
  }, [name, timePeriod]);
  console.log(totalshows);
  console.log("Dashboard Data: ", dashboardData);
  console.log("Pie Data: ", pieData);

  // useEffect(() => {
  //   // Fetch data from Show API from "http://localhost:8000/api/v1/shows/admin/theater?theater=Majestic City - Colombo"
  //   axios
  //     .get(`/shows/admin/theater`, {
  //       params: {
  //           theater: name, // Check if name has something
  //           startDate: period.startDate,
  //           endDate: period.endDate,
  //         },
  //     )
  //     .then((res) => {
  //       // count of total shows
  //       setTotalShows(res.data.length);
  //       // console.log(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [movie]);

  return (
    <main className="main-container">
      <div className="main-title">
        <h1>{name}</h1>
        <div className="filter">
          <label htmlFor="timePeriod"></label>
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
      </div>

      <div className="main-cards">
        <Card
          name="Total Booking"
          value={homeData.totalBookings}
          icon={BsFillArchiveFill}
        />
        <Card
          name="Revenue"
          value={`Rs ${homeData.totalRevenue}`}
          icon={BsFillGrid3X3GapFill}
        />
        <Card
          name="Total Users"
          value={homeData.totalUsers}
          icon={BsPeopleFill}
        />
        <Card
          name="Shows"
          value={parseInt(totalshows, 10)}
          icon={BsFillBellFill}
        />
      </div>

      <div className="charts">
        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dashboardData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Revenue") {
                  return [`${value}K`, name]; // Divide by 1000 for Tooltip as well
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="Total Booking" fill="#0088FE" />
            <Bar dataKey="Revenue" fill="#f69449" />
            <Bar dataKey="Total Customers" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>

        {/* Line Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={dashboardData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Revenue") {
                  return [`${value}K`, name]; // Divide by 1000 for Tooltip as well
                }
                return [value, name];
              }}
            />
            <Legend />

            <Line type="monotone" dataKey="Total Booking" stroke="#0088FE" />
            <Line type="monotone" dataKey="Revenue" stroke="#f69449" />
            <Line
              type="monotone"
              dataKey="Total Customers"
              stroke="#00C49F"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Pie Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="Total Revenue"
              nameKey="Movie"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 0
                      ? "#0088FE"
                      : index === 1
                      ? "#00C49F"
                      : index === 2
                      ? "#FFBB28"
                      : "#FF8042"
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={pieData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Movie" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Total Revenue") {
                  return [`${value}K`, name]; // Divide by 1000 for Tooltip as well
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="Total Bookings" fill="#0088FE" />
            <Bar dataKey="Total Revenue" fill="#f69449" />
            <Bar dataKey="Total Users" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Dashboard;
