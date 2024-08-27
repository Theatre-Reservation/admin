import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./Events.css";

function EventPage() {
  const [events, setEvents] = useState([]);
  const [eventFormVisible, setEventFormVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    admin_id: "",
    title: "",
    description: "",
    poster_path: "",
    venue: "",
    date: "",
    time: "",
    runtime: "",
    price: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editingEventId, setEditingEventId] = useState("");
  const admin_id = "64e1f26b2a91d130d5a14e3f";

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

  const resetForm = () => {
    setNewEvent({
      admin_id: "",
      title: "",
      description: "",
      poster_path: "",
      venue: "",
      date: "",
      time: "",
      runtime: "",
      price: "",
    });
    setEditMode(false);
    setEditingEventId(null);
  };

  const handleAddOrEditEvent = () => {
    console.log("dgfhj");
    const url = editMode ? `events/${editingEventId}` : "events";
    const method = editMode ? "put" : "post";

    console.log("New Event:", newEvent);
    console.log("URL:", url);
    console.log("Method:", method);

    axios({
      method: method,
      url: url,
      data: newEvent,
    })
      .then((response) => {
        console.log(`${editMode ? "Updated" : "Added"} event successfully!`);
        setEditMode(false);
        setEventFormVisible(false); // Close form after successful operation
        // if (editMode) {
        //   setEvents((prevEvents) =>
        //     prevEvents.map((event) =>
        //       event._id === editingEventId ? response.data : event
        //     )
        //   );
        // } else {
        //   setEvents((prevEvents) => [...prevEvents, response.data]);
        // }
        resetForm(); // Reset the form after successful add or edit
      })
      .catch((error) => console.error("Error adding/editing event:", error));
  };

  const handleEditEvent = (eventId) => {
    console.log(eventId);
    axios
      .get(`events/${eventId}`) // Use GET request to fetch event data
      .then((response) => {
        console.log("Event details:", response.data);
        const event = response.data; // Assume event data is in response.data
        setEditingEventId(eventId);
        setNewEvent({
          admin_id: admin_id,
          title: event.title,
          description: event.description,
          poster_path: event.poster_path,
          venue: event.venue,
          date: event.date,
          time: event.time,
          runtime: event.runtime,
          price: event.price,
        });
        setEditMode(true);
        setEventFormVisible(true); // Open form in edit mode
      })
      .catch((error) => console.error("Error fetching event details:", error));
  };

  const handleDeleteEvent = (id) => {
    axios
      .delete(`events/${id}`)
      .then(() => {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== id)
        );
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  return (
    <div className="events-page">
      <div className="events-title-bar">
        <h1>Events</h1>
        <button className="add-btn" onClick={() => setEventFormVisible(true)}>
          Add Event
        </button>
      </div>

      <table className="events-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Venue</th>
            <th>Date</th>
            <th>Runtime</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.title}</td>
              <td>{event.venue}</td>
              <td>{event.date}</td>
              <td>{event.runtime}</td>
              <td>{event.ticket_price}</td>
              <td className="edit-delete-btns">
                <button
                  className="edit-btn"
                  onClick={() => handleEditEvent(event._id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteEvent(event._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {eventFormVisible && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editMode ? "Edit Event" : "Add New Event"}</h2>
              {/* Close icon */}
              <span
                className="close-icon"
                onClick={() => setEventFormVisible(false)}
              >
                &times;
              </span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddOrEditEvent();
              }}
            >
              <div className="form-content">
                <div className="column">
                  <label>
                    <input
                      type="text"
                      name="title"
                      value={newEvent.title}
                      onChange={handleInputChange}
                      placeholder="Event Title"
                    />
                  </label>
                  <label>
                    <textarea
                      name="description"
                      value={newEvent.description}
                      onChange={handleInputChange}
                      placeholder="Description"
                    />
                  </label>
                  <label>
                    <input
                      type="text"
                      name="poster_path"
                      value={newEvent.poster_path}
                      onChange={handleInputChange}
                      placeholder="Image URL"
                    />
                  </label>
                  <label>
                    <input
                      type="text"
                      name="venue"
                      value={newEvent.venue}
                      onChange={handleInputChange}
                      placeholder="Venue"
                    />
                  </label>
                </div>
                <div className="column">
                  <label>
                    Date
                    <input
                      type="Date"
                      name="date"
                      value={newEvent.duration}
                      onChange={handleInputChange}
                      placeholder="Date"
                    />
                  </label>
                  <label>
                    <input
                      type="text"
                      name="runtime"
                      value={newEvent.runtime}
                      onChange={handleInputChange}
                      placeholder="Runtime"
                    />
                  </label>
                  <label>
                    Time
                    <input
                      type="time"
                      name="time"
                      value={newEvent.duration}
                      onChange={handleInputChange}
                      placeholder="Time"
                    />
                  </label>
                  <label>
                    <input
                      type="number"
                      name="price"
                      value={newEvent.price}
                      onChange={handleInputChange}
                      placeholder="Price"
                    />
                  </label>
                </div>
              </div>

              <button type="submit">
                {editMode ? "Update Event" : "Add Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventPage;
