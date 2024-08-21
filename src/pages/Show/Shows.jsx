import React, { useState } from "react";
import axios from "axios";
import { initialShows } from "./ShowsData";
import "./Shows.css";

function ShowsPage() {
  const [shows, setShows] = useState(initialShows);

  const [newShow, setNewShow] = useState({
    title: "",
    date: "",
    time: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShow({ ...newShow, [name]: value });
  };

  const handleAddShow = () => {
    const showId = `S00${shows.length + 1}`;
    const newShowWithId = { ...newShow, id: showId };

    setShows([...shows, newShowWithId]);
    setNewShow({ title: "", date: "", time: "" });
  };

    (() => {
      axios
        .get("/api/v1/data")
        .then((response) => console.log("hsjvz"))
        .catch((error) => console.error("Error fetching data:", error));
    }, []);

  return (
    <div className="shows-page">
      <h1>Shows</h1>

      <div className="add-show-form">
        <h2>Add New Show</h2>
        <input
          type="text"
          name="title"
          value={newShow.title}
          onChange={handleInputChange}
          placeholder="Show Title"
        />
        <input
          type="date"
          name="date"
          value={newShow.date}
          onChange={handleInputChange}
        />
        <input
          type="time"
          name="time"
          value={newShow.time}
          onChange={handleInputChange}
        />
        <button onClick={handleAddShow}>Add Show</button>
      </div>

      <table className="shows-table">
        <thead>
          <tr>
            <th>Show ID</th>
            <th>Title</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((show) => (
            <tr key={show.id}>
              <td>{show.id}</td>
              <td>{show.title}</td>
              <td>{show.date}</td>
              <td>{show.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShowsPage;
