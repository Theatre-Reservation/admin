import React, { useEffect } from "react";
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

import DashboardData from "./DashboardData";
import "./Dashboard.css";
import Card from "../../components/Card/Card";
import axios from "../../axios";

function Dashboard() {
  const [totalshows, setTotalShows] = React.useState(0);
  const [totalrevenue, setTotalRevenue] = React.useState(0);
  const [totalbooking, setTotalBooking] = React.useState(0);
  const [name, setName] = React.useState("");
  const [data, setData] = React.useState(false);
  const [movie, setMovie] = React.useState("");

  // const movie = "Majestic City - Colombo";

  // Fetch user profile when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      const newToken = localStorage.getItem("token");
      console.log("Token: ", newToken);

      if (!newToken) {
        console.log("No token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8500/api/v1/user-auth/profile",
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          }
        );
        // toast("show"); // Set the user data returned from the backend
        console.log(response.data);
        setName(response.data.Name);
        if (response.data.Name === "Majestic City - Colombo") {
          setData(true);
        } else {
          setData(false);
        }
        setMovie(response.data.Name);
      } catch (err) {
        console.log("Failed to fetch user data");
      } finally {
        // setLoading(false); // Stop loading when request completes
      }
    };
    fetchUserProfile();
  }, []);

  // const movie = name;
  // console.log("jjj", movie);

  useEffect(() => {
    // Fetch data from Show API from "http://localhost:8000/api/v1/shows/admin/theater?theater=Majestic City - Colombo"
    axios
      .get(`/shows/admin/theater?theater=${movie}`)
      .then((res) => {
        // count of total shows
        setTotalShows(res.data.length);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data]);

  useEffect(() => {
    // Fetch http://localhost:8000/api/v1/shows/admin/revenue?theater=Majestic City - Colombo
    axios
      .get(`/shows/admin/revenue?theater=${movie}`)
      .then((res) => {
        setTotalRevenue(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data]);

  useEffect(() => {
    // Fetch http://localhost:8000/api/v1/shows/admin/booking?theater=Majestic City - Colombo
    axios
      .get(`/shows/admin/booking?theater=${movie}`)
      .then((res) => {
        console.log(res.data);
        setTotalBooking(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data]);

  const DashData = [
    { name: "Deadpool", value: 43, color: "#0088FE" },
    { name: "Dune", value: 12, color: "#00C49F" },
    { name: "Twisters", value: 10, color: "#FFBB28" },
    { name: "Despicable", value: 9, color: "#FF8042" },
  ];

  return (
    <main className="main-container">
      <div className="main-title">
        <h1>{name}</h1>
      </div>

      <div className="main-cards">
        <Card
          name="Total Booking"
          value={parseInt(totalbooking, 10)}
          icon={BsFillArchiveFill}
        />
        <Card
          name="Revenue"
          value={`Rs ${parseInt(totalrevenue, 10)}`}
          icon={BsFillGrid3X3GapFill}
        />
        <Card
          name="Users"
          value={parseInt(totalbooking / 3, 10)}
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
            data={data ? DashboardData : []}
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
            <Tooltip />
            <Legend />
            <Bar dataKey="Total_Customers" fill="#00C49F" />
            <Bar dataKey="Revenue" fill="#f69449" />
          </BarChart>
        </ResponsiveContainer>

        {/* Line Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data ? DashboardData : []}
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
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Total_Customers"
              stroke="#00C49F"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="Revenue" stroke="#f69449" />
            <Line type="monotone" dataKey="Trans_Amount" stroke="#0088FE" />
          </LineChart>
        </ResponsiveContainer>

        {/* Pie Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data ? DashData : []}
              margin={{
                top: 0,
                right: 30,
                left: 20,
                bottom: 15,
              }}
            >
              {DashData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Dashboard;
