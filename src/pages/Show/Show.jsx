import React, { useState, useEffect } from "react";
import "./Show.css";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ShowsPage() {
  const [uploading, setUploading] = useState(false);
  const [shows, setShows] = useState([]);
  const [editingShow, setEditingShow] = useState(null);
  const [editingMode, setEditingMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShow, setNewShow] = useState({
    movie: "Deadpool & Wolverine",
    theater: "Liberty Cinema - Colombo",
    date: "",
    time: "",
    price: "",
    reserved_seats: ["A5", "C7", "F2"],
    available_seats: "80",
  });
  const navigate = useNavigate();

  const movie = "Deadpool & Wolverine";

  // Fetch show data from an API
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(`/shows/${movie}`);
        setShows(response.data);
        console.log("Shows fetched:", response.data);
        // console.log("Shows:", shows);
      } catch (error) {
        // console.error("Error fetching shows:", error);
        toast.error("Error fetching shows", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };
    fetchShows();
  }, []);

  console.log(shows);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("name", name);
    console.log("value", value);
    setEditingShow((prev) => ({
      ...prev,
      [name]: value,
    }));
    setNewShow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to delete a show
  const deleteShow = async (_id) => {
    try {
      await axios.delete(`/shows/${_id}`);
      setShows(shows.filter((show) => show._id !== _id));
      toast.success("Show deleted successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error deleting the show:", error);
    }
  };

  // Function to handle editing a show
  const handleEdit = (_id) => {
    const showToEdit = shows.find((show) => show._id === _id);
    setEditingShow(showToEdit);
    setEditingMode(true);
    setNewShow({
      movie: showToEdit.movie,
      theater: showToEdit.theater,
      date: showToEdit.date,
      time: showToEdit.time,
      price: showToEdit.price,
      available_seats: showToEdit.available_seats,
    });
    setIsModalOpen(true); // Open the modal
  };

  const resetForm = () => {
    setNewShow({
      // movieTitle: "",
      // theater: "",
      date: "",
      time: "",
      price: "",
      // availableSeats: "",
    });
  };

  // Function to save edited show
  const saveShow = async () => {
    try {
      await axios.patch(`/shows/${editingShow._id}`, editingShow);
      setShows((prevShows) =>
        prevShows.map((show) =>
          show._id === editingShow._id ? editingShow : show
        )
      );
      setIsModalOpen(false);
      setEditingShow(null);
      setEditingMode(false);
      toast.success("Show updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      resetForm();
    } catch (error) {
      console.error("Error updating show:", error);
    }
  };

  const handleAdd = async (newShow) => {
    setUploading(true);
    try {
      console.log("new show111", newShow);
      const response = await axios.post("/shows", newShow);
      setShows((prevShows) => [...prevShows, response.data]);
      setIsModalOpen(false);
      // setNewShow({
      //   movieTitle: "",
      //   theater: "",
      //   date: "",
      //   time: "",
      //   price: "",
      //   availableSeats: "",
      // });
      resetForm();
      setUploading(false);
      toast.success("Show added successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error adding show:", error);
      toast.error("Error adding show", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setUploading(false);
    }
  };

  const showSeats = (_id) => {
    navigate(`/movies/shows/seats/${_id}`);
    console.log("show seats", _id);
  };

  return (
    <div className="shows-page">
      <div className="show-title-bar">
        <h1>{movie}</h1>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          Add Show
        </button>
      </div>
      <table className="shows-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Available Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((show) => (
            <tr key={show._id}>
              <td>{show.date}</td>
              <td>{show.time}</td>
              <td>{show.price}</td>
              <td>
                {/* <SeatsPage _id={show._id} /> */}
                <button
                  className="show-seats-btn"
                  onClick={() => showSeats(show._id)}
                >
                  Show Seats
                </button>
              </td>
              <td className="edit-delete-btns">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(show._id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteShow(show._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen &&
        (console.log("model", newShow),
        (
          <div className="modal">
            <div className="show-modal-content">
              <div className="modal-header">
                <h2>{editingShow ? "Edit Show" : "Add New Show"}</h2>
                {/* Close icon */}
                <span
                  className="close-icon"
                  onClick={() => {
                    setIsModalOpen(false), setEditingMode(false), resetForm();
                  }}
                >
                  &times;
                </span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingMode) {
                    saveShow();
                  } else {
                    handleAdd(newShow);
                  }
                }}
              >
                <label>
                  Date
                  <input
                    type="date"
                    name="date"
                    value={newShow.date.split("T")[0]}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Time
                  <input
                    type="time"
                    name="time"
                    value={newShow.time}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Price
                  <input
                    type="number"
                    name="price"
                    value={newShow.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    required
                  />
                </label>
                <button type="submit">
                  {uploading
                    ? "Updating..."
                    : editingShow
                    ? "Save Changes"
                    : "Add Show"}
                </button>
              </form>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ShowsPage;
