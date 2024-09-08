import React from "react";
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

function Dashboard() {
  const DashData = [
    { name: "Deadpool", value: 400, color: "#0088FE" },
    { name: "Dune", value: 300, color: "#00C49F" },
    { name: "Twisters", value: 300, color: "#FFBB28" },
    { name: "Despicable", value: 100, color: "#FF8042" },
  ];

  const Total_Revenue = (DashboardData) => {
    DashboardData.map()
  }

  return (
    <main className="main-container">
      <div className="main-title">
        <h1>Dashboard</h1>
      </div>

      <div className="main-cards">
        <Card name="Total Booking" value="53" icon={BsFillArchiveFill} />
        <Card name="Revenue" value="12" icon={BsFillGrid3X3GapFill} />
        <Card name="Today's Users" value="33" icon={BsPeopleFill} />
        <Card name="Shows" value="10" icon={BsFillBellFill} />
      </div>

      <div className="charts">
        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={DashboardData}
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
            data={DashboardData}
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
              data={DashData}
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
