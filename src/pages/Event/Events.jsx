import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./Events.css";

function EventPage() {
  const [Events, setEvents] = useState([]);
  const [EventForm, setEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    img_url: "",
    description: "",
    genre: "",
    duration: "",
    schedules: [{ date: "", time: "", theater_id: "" }],
  });
  const [editMode, setEditMode] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    // Fetch all the Events from the backend API
    axios
      .get("Events")
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching Events:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const newSchedules = [...newEvent.schedules];
    newSchedules[index] = { ...newSchedules[index], [name]: value };
    setNewEvent({ ...newEvent, schedules: newSchedules });
  };

  const handleAddSchedule = () => {
    setNewEvent({
      ...newEvent,
      schedules: [...newEvent.schedules, { date: "", time: "", theater_id: "" }],
    });
  };

  const handleAddEvent = async () => {
    try {
      const response = await axios.post("/api/events", newEvent);
      setEvents([...Events, response.data]);
      setNewEvent({
        title: "",
        img_url: "",
        description: "",
        genre: "",
        duration: "",
        date: "",
        time: "",
        theater_id: "",
      });
      setEventForm(false);
    } catch (error) {
      console.error("Error adding Event:", error);
    }
  };

  const handleEditEvent = (Event) => {
    setNewEvent({
      title: Event.title,
      img_url: Event.img_url,
      description: Event.description,
      genre: Event.genre,
      duration: Event.duration,
      schedules: Event.schedules,
    });
    setEditMode(true);
    setEditingEventId(Event._id);
  };

  const handleDeleteEvent = (id) => {
    axios
      .delete(`events/${id}`)
      .then(() => {
        setEvents(Events.filter((Event) => Event._id !== id));
      })
      .catch((error) => console.error("Error deleting Event:", error));
  };

  return (
    <div className="events-page">
      <h1>Events</h1>
      <table className="events-table">
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
          {Events.map((Event) => (
            <tr key={Event._id}>
              <td>{Event.title}</td>
              <td>{Event.genre}</td>
              <td>{Event.description}</td>
              <td>{Event.duration} min</td>
              <td>
                {Event.schedules.map((schedule, index) => (
                  <div key={index}>
                    <p>
                      {schedule.date} at {schedule.time} - Theater:{" "}
                      {schedule.theater_id}
                    </p>
                  </div>
                ))}
              </td>
              <td>
                <button onClick={() => handleEditEvent(Event)}>Edit</button>
                <button onClick={() => handleDeleteEvent(Event._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-event-form">
        <h2>{editMode ? "Edit Event" : "Add New Event"}</h2>
        <input
          type="text"
          name="title"
          value={newEvent.title}
          onChange={handleInputChange}
          placeholder="Event Title"
        />
        <input
          type="text"
          name="img_url"
          value={newEvent.img_url}
          onChange={handleInputChange}
          placeholder="Image URL"
        />
        <textarea
          name="description"
          value={newEvent.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        {/* <input
          type="text"
          name="genre"
          value={newEvent.genre}
          onChange={handleInputChange}
          placeholder="Genre"
        /> */}
        <input
          type="number"
          name="duration"
          value={newEvent.duration}
          onChange={handleInputChange}
          placeholder="Duration (minutes)"
        />

        {newEvent.schedules.map((schedule, index) => (
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
            {/* <input
              type="text"
              name="theater_id"
              value={schedule.theater_id}
              onChange={(e) => handleScheduleChange(index, e)}
              placeholder="Theater ID"
            /> */}
          </div>
        ))}
        <button onClick={handleAddSchedule}>Add Another Schedule</button>
        <button onClick={handleAddEvent}>
          {editMode ? "Update Event" : "Add Event"}
        </button>
      </div>
    </div>
  );
}

export default EventPage;
