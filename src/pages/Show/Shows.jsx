import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./Shows.css";

function ShowsPage() {
  const [shows, setShows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newShow, setNewShow] = useState({
    title: "",
    img_url: "",
    description: "",
    genre: "",
    duration: "",
    schedules: [{ date: "", time: "", theater_id: "" }],
  });
  const [editMode, setEditMode] = useState(false);
  const [editingShowId, setEditingShowId] = useState(null);

  useEffect(() => {
    // Fetch shows from the backend API
    axios
      .get("shows")
      .then((response) => setShows(response.data))
      .catch((error) => console.error("Error fetching shows:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShow({ ...newShow, [name]: value });
  };

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const newSchedules = [...newShow.schedules];
    newSchedules[index] = { ...newSchedules[index], [name]: value };
    setNewShow({ ...newShow, schedules: newSchedules });
  };

  const handleAddSchedule = () => {
    setNewShow({
      ...newShow,
      schedules: [...newShow.schedules, { date: "", time: "", theater_id: "" }],
    });
  };

  const handleAddShow = async () => {
    try {
      const response = await axios.post("/api/shows", newShow);
      setShows([...shows, response.data]);
      setNewShow({
        title: "",
        img_url: "",
        description: "",
        genre: "",
        duration: "",
        date: "",
        time: "",
        theater_id: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding show:", error);
    }
  };

  const handleEditShow = (show) => {
    setNewShow({
      title: show.title,
      img_url: show.img_url,
      description: show.description,
      genre: show.genre,
      duration: show.duration,
      schedules: show.schedules,
    });
    setEditMode(true);
    setEditingShowId(show._id);
  };

  const handleDeleteShow = (id) => {
    axios
      .delete(`shows/${id}`)
      .then(() => {
        setShows(shows.filter((show) => show._id !== id));
      })
      .catch((error) => console.error("Error deleting show:", error));
  };

  return (
    <div className="shows-page">
      <h1>Shows</h1>
      <table className="shows-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Genre</th>
            <th>Description</th>
            <th>Duration</th>
            <th>Schedules</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((show) => (
            <tr key={show._id}>
              <td>{show.title}</td>
              <td>{show.genre}</td>
              <td>{show.description}</td>
              <td>{show.duration} min</td>
              <td>
                {show.schedules.map((schedule, index) => (
                  <div key={index}>
                    <p>
                      {schedule.date} at {schedule.time} - Theater:{" "}
                      {schedule.theater_id}
                    </p>
                  </div>
                ))}
              </td>
              <td>
                <button onClick={() => handleEditShow(show)}>Edit</button>
                <button onClick={() => handleDeleteShow(show._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-show-form">
        <h2>{editMode ? "Edit Show" : "Add New Show"}</h2>
        <input
          type="text"
          name="title"
          value={newShow.title}
          onChange={handleInputChange}
          placeholder="Show Title"
        />
        <input
          type="text"
          name="img_url"
          value={newShow.img_url}
          onChange={handleInputChange}
          placeholder="Image URL"
        />
        <textarea
          name="description"
          value={newShow.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="text"
          name="genre"
          value={newShow.genre}
          onChange={handleInputChange}
          placeholder="Genre"
        />
        <input
          type="number"
          name="duration"
          value={newShow.duration}
          onChange={handleInputChange}
          placeholder="Duration (minutes)"
        />

        {newShow.schedules.map((schedule, index) => (
          <div key={index}>
            <input
              type="date"
              name="date"
              value={schedule.date}
              onChange={(e) => handleScheduleChange(index, e)}
            />
            <input
              type="time"
              name="time"
              value={schedule.time}
              onChange={(e) => handleScheduleChange(index, e)}
            />
            <input
              type="text"
              name="theater_id"
              value={schedule.theater_id}
              onChange={(e) => handleScheduleChange(index, e)}
              placeholder="Theater ID"
            />
          </div>
        ))}
        <button onClick={handleAddSchedule}>Add Another Schedule</button>
        <button onClick={handleAddShow}>
          {editMode ? "Update Show" : "Add Show"}
        </button>
      </div>
    </div>
  );
}

export default ShowsPage;
