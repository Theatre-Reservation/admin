import React, { useState, useEffect } from "react";
import "./Reservations.css";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    // Fetch reservation data from an API
    const fetchReservations = async () => {
      // const data = await fetch("/api/reservations").then((res) => res.json());
      const data = [
        {
          id: 1,
          customerName: "Alice Smith",
          movieTitle: "The Matrix",
          showTime: "2024-08-21T14:00:00Z",
          seats: ["A1", "A2", "A3"],
        },
        {
          id: 2,
          customerName: "John Doe",
          movieTitle: "Inception",
          showTime: "2024-08-21T18:30:00Z",
          seats: ["B4", "B5"],
        },
        {
          id: 3,
          customerName: "Emma Johnson",
          movieTitle: "The Godfather",
          showTime: "2024-08-22T20:00:00Z",
          seats: ["C1", "C2"],
        },
        {
          id: 4,
          customerName: "Michael Brown",
          movieTitle: "Pulp Fiction",
          showTime: "2024-08-23T16:00:00Z",
          seats: ["D5", "D6", "D7"],
        },
        {
          id: 5,
          customerName: "Sophia Williams",
          movieTitle: "The Shawshank Redemption",
          showTime: "2024-08-23T21:00:00Z",
          seats: ["E2", "E3"],
        },
      ];
      setReservations(data);
    };

    fetchReservations();
  }, []);

  const deleteReservation = async (id) => {
    await fetch(`/api/reservations/${id}`, {
      method: "DELETE",
    });
    setReservations(
      reservations.filter((reservation) => reservation.id !== id)
    );
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

  const handleEdit = (id) => {
    // Logic to handle editing a reservation
    console.log(`Edit reservation with ID: ${id}`);
    // Could open a modal with a form to edit the reservation
  };

  const handleAdd = async (newReservation) => {
    // Logic to post a new reservation
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReservation),
    });
    const addedReservation = await response.json();
    setReservations([...reservations, addedReservation]);
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
            <th onClick={() => sortBy("showTime")}>Show Time</th>
            <th onClick={() => sortBy("seats")}>Seats</th>
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
              <td>
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
      <button
        onClick={() =>
          handleAdd({
            // id: reservations.length + 1,
            // customerName: "New Customer",
            // movieTitle: "New Movie",
            // showTime: "2024-08-26T19:00:00Z",
            // seats: ["B1", "B2"],
          })
        }
      >
        Add Reservation
      </button>
    </div>
  );
};

export default ReservationsPage;
