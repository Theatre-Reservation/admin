import React, { useState, useEffect } from "react";
import "./Reservations.css";
import axios from "../../axios";
// import data from "./Data"; 


function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [editingReservation, setEditingReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReservation, setNewReservation] = useState({
    customerName: "",
    movieTitle: "",
    showTime: "",
    seats: "",
  });

  // Fetch reservation data from an API
  useEffect(() => {
    const fetchReservations = async () => {
      const response = await axios.get("/reservations");
      console.log(response.data);
      setReservations(response.data);
    };
    fetchReservations();
  }, []);

  // Function to delete a reservation
  const deleteReservation = async (id) => {
    try {
      // Send a DELETE request using axios
      await axios.delete(`/reservations/${id}`);

      // Update the local state to remove the deleted reservation
      setReservations(
        reservations.filter((reservation) => reservation.id !== id)
      );
      console.log(`Reservation with ID ${id} deleted successfully.`);
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
    // Find the reservation by ID
    const reservationToEdit = reservations.find((res) => res.id === id);
    setEditingReservation(reservationToEdit);
    setIsModalOpen(true); // Open the modal
    saveReservation();
  };

  // Function to save edited reservation
  const saveReservation = async () => {
    try {
      // Update the reservation in the backend
      await axios.put(
        `/reservations/${editingReservation.id}`,
        editingReservation
      );

      // Update the reservation in the state
      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          res.id === editingReservation.id ? editingReservation : res
        )
      );

      // Close the modal and reset editing state
      setIsModalOpen(false);
      setEditingReservation(null);
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

const handleAdd = async (newReservation) => {
  try {
    // Post a new reservation using Axios
    const response = await axios.post("/reservations", newReservation);

    // Retrieve the added reservation from the response
    const addedReservation = response.data;

    // Update the reservations state with the newly added reservation
    setReservations((prevReservations) => [
      ...prevReservations,
      addedReservation,
    ]);

    // Close the modal after adding
    setIsModalOpen(false);
  } catch (error) {
    console.error("Error adding reservation:", error);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="reservations-page">
      <h1>Reservations</h1>
      <table className="reservations-table">
        <thead>
          <tr>
            <th onClick={() => sortBy("id")}>Reservation ID</th>
            <th onClick={() => sortBy("customerName")}>Customer Name</th>
            <th onClick={() => sortBy("movieTitle")}>Movie Title</th>
            <th onClick={() => sortBy("showTime")}>Run Time</th>
            <th>Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{reservation.customerName}</td>
              <td>{reservation.movieTitle}</td>
              <td>{reservation.showTime}</td>
              <td>{reservation.seats.join(", ")}</td>
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

      <button className="add-btn" onClick={() => setIsModalOpen(true)}>
        Add Reservation
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Reservation</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAdd(newReservation);
              }}
            >
              <label>
                Customer Name
                <input
                  type="text"
                  name="customerName"
                  value={newReservation.customerName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Movie Title
                <input
                  type="text"
                  name="movieTitle"
                  value={newReservation.movieTitle}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Run Time
                <input
                  type="datetime-local"
                  name="runTime"
                  value={newReservation.runTime}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Seats (comma-separated)
                <input
                  type="text"
                  name="seats"
                  value={newReservation.seats}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationsPage;
