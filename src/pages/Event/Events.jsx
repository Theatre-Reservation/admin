import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./Events.css";

function EventPage() {
  const [events, setEvents] = useState([]);
  const [eventFormVisible, setEventFormVisible] = useState(false);
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
    // Fetch all the events from the backend API
    axios
      .get("events")
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleScheduleChange = (index, e) => {
    const { name, value } = e.target;
    const newSchedules = [...newEvent.schedules];
    newSchedules[index] = { ...newSchedules[index], [name]: value };
    setNewEvent((prevEvent) => ({ ...prevEvent, schedules: newSchedules }));
  };

  const handleAddSchedule = () => {
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      schedules: [
        ...prevEvent.schedules,
        { date: "", time: "", theater_id: "" },
      ],
    }));
  };

  const resetForm = () => {
    setNewEvent({
      title: "",
      img_url: "",
      description: "",
      genre: "",
      duration: "",
      schedules: [{ date: "", time: "", theater_id: "" }],
    });
    setEditMode(false);
    setEditingEventId(null);
  };

  const handleAddOrEditEvent = async () => {
    try {
      if (editMode) {
        // Update the existing event
        const response = await axios.put(
          `/api/events/${editingEventId}`,
          newEvent
        );
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === editingEventId ? response.data : event
          )
        );
      } else {
        // Add a new event
        const response = await axios.post("/api/events", newEvent);
        setEvents((prevEvents) => [...prevEvents, response.data]);
      }
      resetForm();
      setEventFormVisible(false);
    } catch (error) {
      console.error("Error adding/editing event:", error);
    }
  };

  const handleEditEvent = (event) => {
    setNewEvent({
      title: event.title,
      img_url: event.img_url,
      description: event.description,
      genre: event.genre,
      duration: event.duration,
      schedules: event.schedules,
    });
    setEditMode(true);
    setEditingEventId(event._id);
    setEventFormVisible(true);
  };

  const handleDeleteEvent = (id) => {
    axios
      .delete(`/api/events/${id}`)
      .then(() => {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== id)
        );
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  return (
    <div className="events-page">
      <h1>Events</h1>
      <button onClick={() => setEventFormVisible(!eventFormVisible)}>
        {eventFormVisible ? "Hide Form" : "Add New Event"}
      </button>
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
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.title}</td>
              <td>{event.genre}</td>
              <td>{event.description}</td>
              <td>{event.duration} min</td>
              <td>
                {event.schedules.map((schedule, index) => (
                  <div key={index}>
                    <p>
                      {schedule.date} at {schedule.time} - Theater:{" "}
                      {schedule.theater_id}
                    </p>
                  </div>
                ))}
              </td>
              <td>
                <button onClick={() => handleEditEvent(event)}>Edit</button>
                <button onClick={() => handleDeleteEvent(event._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {eventFormVisible && (
        <div className="event-form">
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
          <input
            type="text"
            name="genre"
            value={newEvent.genre}
            onChange={handleInputChange}
            placeholder="Genre"
          />
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
          <button onClick={handleAddOrEditEvent}>
            {editMode ? "Update Event" : "Add Event"}
          </button>
        </div>
      )}
    </div>
  );
}

export default EventPage;
