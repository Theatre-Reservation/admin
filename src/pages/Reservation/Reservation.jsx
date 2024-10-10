import React, { useState, useEffect } from "react";
import "./Reservations.css";
import axios from "../../axios";

function ReservationsPage() {
  const [uploading, setUploading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [editingReservation, setEditingReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReservation, setNewReservation] = useState({
    customerId: "",
    movieTitle: "",
    theater: "",
    reserved_seats: [],
    available_seats: "",
    price: "",
  });

  // Fetch reservation data from an API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("/shows");
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
    fetchReservations();
  }, []);

  // Function to delete a reservation
  const deleteReservation = async (id) => {
    try {
      await axios.delete(`/reservations/${id}`);
      setReservations(
        reservations.filter((reservation) => reservation.id !== id)
      );
    } catch (error) {
      console.error("Error deleting the reservation:", error);
    }
  };

  const sortBy = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...reservations].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setReservations(sortedData);
  };

  // Function to handle editing a reservation
  const handleEdit = (id) => {
    const reservationToEdit = reservations.find((res) => res.id === id);
    setEditingReservation(reservationToEdit);
    setIsModalOpen(true); // Open the modal
  };

  // Function to save edited reservation
  const saveReservation = async () => {
    try {
      await axios.put(
        `/reservations/${editingReservation.id}`,
        editingReservation
      );
      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          res.id === editingReservation.id ? editingReservation : res
        )
      );
      setIsModalOpen(false);
      setEditingReservation(null);
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  const handleAdd = async (newReservation) => {
    setUploading(true);
    try {
      const response = await axios.post("/reservations", newReservation);
      setReservations((prevReservations) => [
        ...prevReservations,
        response.data,
      ]);
      setIsModalOpen(false);
      setNewReservation({
        customerName: "",
        movieTitle: "",
        showTime: "",
        seats: [],
      });
      setUploading(false);
    } catch (error) {
      console.error("Error adding reservation:", error);
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation((prev) => ({
      ...prev,
      [name]:
        name === "seats" ? value.split(",").map((seat) => seat.trim()) : value,
    }));
  };

  return (
    <div className="reservations-page">
      <div className="reservation-title-bar">
        <h1>Reservations</h1>
        {/* <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          Add Reservation
        </button> */}
      </div>
      <table className="reservations-table">
        <thead>
          <tr>
            {/* <th onClick={() => sortBy("customerId")}>Reservation ID</th> */}
            <th onClick={() => sortBy("movieTitle")}>Movie Title</th>
            <th onClick={() => sortBy("theater")}>Theater</th>
            <th>Reserved Seats</th>
            {/* <th onClick={() => sortBy("available_seats")}>Available Seats</th> */}
            <th onClick={() => sortBy("price")}>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations?.map((reservation) => (
            <tr key={reservation._id}>
              {/* <td>{reservation._id}</td> */}
              <td>{reservation.movie}</td>
              <td>{reservation.theater}</td>
              {/* <td>{reservation.reserved_seats.join(", ")}</td> */}
              <td>{reservation.available_seats}</td>
              <td>{reservation.price}</td>
              <td className="edit-delete-btns">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(reservation.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteReservation(reservation.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {editingReservation
                  ? "Edit Reservation"
                  : "Add New Reservation"}
              </h2>{" "}
              {/* Close icon */}
              <span
                className="close-icon"
                onClick={() => {
                  setIsModalOpen(false), resetForm();
                }}
              >
                &times;
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingReservation) {
                  saveReservation();
                } else {
                  handleAdd(newReservation);
                }
              }}
            >
              <label>
                <input
                  type="text"
                  name="movietitle"
                  // value={newReservation.movieTitle}
                  onChange={handleInputChange}
                  placeholder="Movie Title	"
                  required
                />
              </label>
              <label>
                <input
                  type="text"
                  name="theater"
                  // value={newReservation.theater}
                  onChange={handleInputChange}
                  placeholder="Theater"
                  required
                />
              </label>
              <label>
                Seats (comma-separated)
                <input
                  type="text"
                  name="seats"
                  // value={newReservation.reserved_seats}
                  onChange={handleInputChange}
                  placeholder="Seats"
                  required
                />
              </label>
              <button type="submit">
                {uploading
                  ? "Updating..."
                  : editingReservation
                  ? "Save Changes"
                  : "Add Reservation"}
              </button>
              {/* <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button> */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationsPage;
