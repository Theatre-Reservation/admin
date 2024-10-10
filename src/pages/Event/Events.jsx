import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./Events.css";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import EventPreview from "../../components/Preview/EventPreview";
import { toast } from "react-toastify";

function EventPage() {
  const [uploading, setUploading] = useState(false);
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
    ticket_price: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editingEventId, setEditingEventId] = useState("");
  const admin_id = "64e1f26b2a91d130d5a14e3f";

  const [imageFile, setImageFile] = useState(null);
  const [handleTime, setHandleTime] = useState(false);
  const [runtime, setRuntime] = useState({
    runtimeHours: "",
    runtimeMinutes: "",
  });

  // Fetch all the events from the backend API
  useEffect(() => {
    axios
      .get("events")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  /* Handle input changes in the form */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    if (name === "runtimeHours" || name === "runtimeMinutes") {
      console.log("djshjb");
      setRuntime((prevState) => {
        const updatedRuntime = {
          ...prevState,
          [name]: value,
        };
        console.log("dsfjhsd", updatedRuntime);
        // After updating runtime, update the newEvent runtime
        setNewEvent((prevEvent) => ({
          ...prevEvent,
          runtime: `${updatedRuntime.runtimeHours || 0} hrs ${
            updatedRuntime.runtimeMinutes || 0
          } mins`,
        }));
        console.log("New event data runtime:", newEvent);
      });
    } else {
      setNewEvent({
        ...newEvent,
        [name]: value,
      });
    }
    console.log("New event data:", newEvent);
  };

  /* Handle time input changes in the form */
  const handleTimeChange = (e) => {
    const timeValue = e.target.value; // "HH:mm" format
    setHandleTime(true);
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      time: timeValue,
    }));
  };

  // Convert 12-hour time ("hh:mm AM/PM") back to 24-hour time ("HH:mm")
  const convertTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00"; // Convert 12 AM to 00 hours (midnight)
    }
    if (modifier === "PM") {
      hours = String(parseInt(hours, 10) + 12); // Convert PM hours to 24-hour format
    }

    const formattedTime = `${hours.padStart(2, "0")}:${minutes}`;
    return formattedTime;
  };

  // Convert the time to AM/PM format or custom string when sending data
  const formatTimeForSend = (time) => {
    const [hours, minutes] = time.split(":");
    if (handleTime) {
      const formattedTime = `${hours >= 12 ? hours - 12 : hours}:${minutes} ${
        hours >= 12 ? "PM" : "AM"
      }`;
      setHandleTime(false);
      console.log("Formatted time:", formattedTime);
      return formattedTime;
    } else {
      return time;
    }
  };

  /* Handle image input changes in the form */
  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    console.log("Uploading image...");
    setUploading(true);
    if (imageFile) {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      uploadBytes(storageRef, imageFile)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setNewEvent({
              ...newEvent,
              poster_path: url,
            });
            console.log("File available at", url);
            console.log("New event data url:", newEvent);
          });
          handleAddOrEditEvent();
          setUploading(false);
        })
        .catch((error) => {
          console.error("Error uploading Image: ", error);
          setUploading(false);
        });
    } else {
      handleAddOrEditEvent();
      setUploading(false);
    }
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
      ticket_price: "",
    });
    setEditMode(false);
    setEditingEventId(null);
  };

  const handleAddOrEditEvent = () => {
    const url = editMode ? `events/${editingEventId}` : "events";
    const method = editMode ? "put" : "post";
    const tost = editMode ? "Updated" : "Added";

    axios({
      method: method,
      url: url,
      data: {
        ...newEvent,
        time: formatTimeForSend(newEvent.time),
      },
    })
      .then((response) => {
        console.log(`${editMode ? "Updated" : "Added"} event successfully!`);
        console.log("Response data:", response.data);
        toast.success(`Event ${tost} successfully!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setEditMode(false);
        setEventFormVisible(false); // Close form after successful operation
        if (editMode) {
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event._id === editingEventId ? response.data : event
            )
          );
          console.log("Event details after:", newEvent);
        } else {
          setEvents((prevEvents) => [...prevEvents, response.data]);
        }
        resetForm(); // Reset the form after successful add or edit
      })
      .catch((error) => console.error("Error adding/editing event:", error));
  };

  const handleEditEvent = (eventId) => {
    axios
      .get(`events/${eventId}`) // Use GET request to fetch event data
      .then((response) => {
        console.log("Event details:", response.data);
        const event = response.data; // Assume event data is in response.data
        setEditingEventId(eventId);
        setNewEvent({
          admin_id: event.admin_id,
          title: event.title,
          description: event.description,
          poster_path: event.poster_path,
          venue: event.venue,
          date: event.date,
          time: event.time,
          runtime: event.runtime,
          ticket_price: event.ticket_price,
        });

        const [hours, mins] = event.runtime
          .replace("hrs", ",")
          .replace("mins", "")
          .split(",")
          .map(Number);
        console.log("Hours:", hours, "Mins:", mins);
        setRuntime({
          runtimeHours: hours,
          runtimeMinutes: mins,
        });

        console.log("Event details after:", newEvent);

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
        toast.success("Event deleted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
            <th>Time</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.title}</td>
              <td>{event.venue}</td>
              <td>{event.date.split("T")[0]}</td>
              <td>{event.runtime}</td>
              <td>{event.time}</td>
              <td>{"LKR " + event.ticket_price}</td>
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
                <EventPreview id={event._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {eventFormVisible && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editMode ? "Update Event" : "Add Event"}</h2>
              {/* Close icon */}
              <span
                className="close-icon"
                onClick={() => {
                  setEventFormVisible(false), resetForm();
                }}
              >
                &times;
              </span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpload();
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
                    <input
                      type="text"
                      name="venue"
                      value={newEvent.venue}
                      onChange={handleInputChange}
                      placeholder="Venue"
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
                  <div>
                    <label>
                      Image URL
                      <input
                        type="file"
                        name="poster_path"
                        // value={newEvent.poster_path}
                        onChange={handleFileChange}
                        placeholder="Image URL"
                      />
                    </label>
                  </div>
                </div>
                <div className="column">
                  <label>
                    Date
                    <input
                      type="Date"
                      name="date"
                      value={newEvent.date.split("T")[0]}
                      onChange={handleInputChange}
                      placeholder="Date"
                    />
                  </label>
                  {/* <div className="runtime">
                    <label>
                      Runtime
                      <input
                        type="number"
                        name="runtimeHours"
                        value={runtime.runtimeHours}
                        onChange={handleInputChange}
                        placeholder="hrs"
                      />
                      <input
                        type="number"
                        name="runtimeMinutes"
                        value={runtime.runtimeMinutes}
                        onChange={handleInputChange}
                        placeholder="mins"
                      />
                    </label>
                  </div> */}
                  <label>
                    Runtime
                    <input
                      type="text"
                      name="runtime"
                      value={newEvent.runtime}
                      onChange={handleInputChange}
                      placeholder="e.g., 2 hrs 10 mins"
                    />
                  </label>

                  <label>
                    Time
                    <input
                      type="time"
                      name="time"
                      value={convertTo24HourFormat(newEvent.time)}
                      onChange={handleTimeChange} // Handles the time input change
                    />
                  </label>
                  <label>
                    Price
                    <input
                      type="number"
                      name="ticket_price"
                      value={newEvent.ticket_price}
                      onChange={handleInputChange}
                      placeholder="Price"
                    />
                  </label>
                </div>
              </div>

              <button type="submit">
                {uploading
                  ? "Uploading..."
                  : editMode
                  ? "Update Event"
                  : "Add Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventPage;

// import React, { useState, useEffect } from "react";
// import axios from "../../axios";
// import EventList from "../../components/Event/EventList";
// import EventForm from "../../components/Event/EventForm";
// import Modal from "../../components/Event/Modal";
// import "./Events.css";

// function EventPage() {
//   const [events, setEvents] = useState([]);
//   const [eventFormVisible, setEventFormVisible] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [editingEventId, setEditingEventId] = useState("");
//   const [newEvent, setNewEvent] = useState(null);

//   const admin_id = "64e1f26b2a91d130d5a14e3f";

//   useEffect(() => {
//     // Fetch all the events from the backend API
//     axios
//       .get("events")
//       .then((response) => {
//         setEvents(response.data);
//       })
//       .catch((error) => console.error("Error fetching events:", error));
//   }, []);

//   const handleAddOrEditEvent = (eventData) => {
//     const url = editMode ? `events/${editingEventId}` : "events";
//     const method = editMode ? "put" : "post";

//     axios({
//       method: method,
//       url: url,
//       data: eventData,
//     })
//       .then((response) => {
//         if (editMode) {
//           setEvents((prevEvents) =>
//             prevEvents.map((event) =>
//               event._id === editingEventId ? response.data : event
//             )
//           );
//         } else {
//           setEvents((prevEvents) => [...prevEvents, response.data]);
//         }
//         setEventFormVisible(false);
//         setEditMode(false);
//         setNewEvent(null);
//       })
//       .catch((error) => console.error("Error adding/editing event:", error));
//   };

//   const handleEditEvent = (eventId) => {
//     const eventToEdit = events.find((event) => event._id === eventId);
//     setEditingEventId(eventId);
//     setEditMode(true);
//     setNewEvent(eventToEdit);
//     setEventFormVisible(true);
//   };

//   const handleDeleteEvent = (eventId) => {
//     axios
//       .delete(`events/${eventId}`)
//       .then(() => {
//         setEvents((prevEvents) =>
//           prevEvents.filter((event) => event._id !== eventId)
//         );
//       })
//       .catch((error) => console.error("Error deleting event:", error));
//   };

//   return (
//     <div className="events-page">
//       <div className="events-title-bar">
//         <h1>Events</h1>
//         <button className="add-btn" onClick={() => setEventFormVisible(true)}>
//           Add Event
//         </button>
//       </div>
//       <EventList
//         events={events}
//         onEdit={handleEditEvent}
//         onDelete={handleDeleteEvent}
//       />
//       {eventFormVisible && (
//         <Modal onClose={() => setEventFormVisible(false)}>
//           <EventForm
//             onSubmit={handleAddOrEditEvent}
//             editMode={editMode}
//             event={newEvent}
//             admin_id={admin_id}
//           />
//         </Modal>
//       )}
//     </div>
//   );
// }

// export default EventPage;
