import React, { useState, useEffect } from "react";
import "./Show.css";
import axios from "../../axios";
import SeatsPage from "../Seat/Seats";
import { useNavigate } from "react-router-dom";

function ShowsPage() {
  const [uploading, setUploading] = useState(false);
  const [shows, setShows] = useState([]);
  const [editingShow, setEditingShow] = useState(null);
  //   const [editingMode, setEditingMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShow, setNewShow] = useState({
    movieTitle: "",
    theater: "",
    date: "",
    time: "",
    price: "",
    availableSeats: "",
  });
  const navigate = useNavigate();

  const movie = "Deadpool & Wolverine";

  // Fetch show data from an API
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(`/shows/${movie}`);
        setShows(response.data);
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };
    fetchShows();
  }, []);

  console.log(shows);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to delete a show
  const deleteShow = async (id) => {
    try {
      await axios.delete(`/shows/${id}`);
      setShows(shows.filter((show) => show.id !== id));
    } catch (error) {
      console.error("Error deleting the show:", error);
    }
  };

  // Function to handle editing a show
  const handleEdit = (id) => {
    const showToEdit = shows.find((show) => show.id === id);
    setEditingShow(showToEdit);
    // setEditingMode(true);
    setNewShow({
      movieTitle: showToEdit.movieTitle,
      theater: showToEdit.theater,
      date: showToEdit.date,
      time: showToEdit.time,
      price: showToEdit.price,
      availableSeats: showToEdit.availableSeats,
    });
    setIsModalOpen(true); // Open the modal
  };

  const resetForm = () => {
    setNewShow({
      movieTitle: "",
      theater: "",
      date: "",
      time: "",
      price: "",
      availableSeats: "",
    });
  };

  // Function to save edited show
  const saveShow = async () => {
    try {
      await axios.put(`/shows/${editingShow.id}`, editingShow);
      setShows((prevShows) =>
        prevShows.map((show) =>
          show.id === editingShow.id ? editingShow : show
        )
      );
      setIsModalOpen(false);
      setEditingShow(null);
    } catch (error) {
      console.error("Error updating show:", error);
    }
  };

  const handleAdd = async (newShow) => {
    setUploading(true);
    try {
      const response = await axios.post("/shows", newShow);
      setShows((prevShows) => [...prevShows, response.data]);
      setIsModalOpen(false);
      setNewShow({
        movieTitle: "",
        theater: "",
        date: "",
        time: "",
        price: "",
        availableSeats: "",
      });
      setUploading(false);
    } catch (error) {
      console.error("Error adding show:", error);
      setUploading(false);
    }
  };

  const showSeats = (id) => {
    navigate(`/moviepage/showpage/seatpage/${id}`);
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
            {/* <th onClick={() => sortBy("movieTitle")}>Movie Title</th> */}
            <th>Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Available Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shows.map((show) => (
            <tr key={show.id}>
              <td>{show.date}</td>
              <td>{show.time}</td>
              <td>{show.price}</td>
              <td>
                {/* <SeatsPage id={show.id} /> */}
                <button onClick={() => showSeats(show.id)}>Show Seats</button>
              </td>
              <td className="edit-delete-btns">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(show.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteShow(show.id)}
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
                    setIsModalOpen(false), setEditingShow(null), resetForm();
                  }}
                >
                  &times;
                </span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingShow) {
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
