import React, { useState } from "react";

function EventForm({ onSubmit, editMode, event, admin_id }) {
  const [newEvent, setNewEvent] = useState(
    event || {
      admin_id: admin_id,
      title: "",
      description: "",
      poster_path: "",
      venue: "",
      date: "",
      time: "",
      runtime: "",
      price: "",
    }
  );
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(newEvent);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="form-content">
        <div className="column">
          <label>
            Event Title
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Venue
            <input
              type="text"
              name="venue"
              value={newEvent.venue}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="column">
          <label>
            Date
            <input
              type="date"
              name="date"
              value={newEvent.date.split("T")[0]}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Runtime
            <input
              type="text"
              name="runtime"
              value={newEvent.runtime}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Time
            <input
              type="time"
              name="time"
              value={newEvent.time}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Price
            <input
              type="text"
              name="price"
              value={newEvent.price}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Image
            <input type="file" onChange={handleFileChange} />
          </label>
        </div>
      </div>
      <button type="submit">{editMode ? "Update Event" : "Add Event"}</button>
    </form>
  );
}

export default EventForm;
