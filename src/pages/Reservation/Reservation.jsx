import React, { useState, useEffect } from "react";
import "./Reservations.css";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Simulate fetching reservation data from an API
    const fetchReservations = async () => {
      const data = await fetch("/api/reservations").then((res) => res.json());
      setReservations(data);
    };

    fetchReservations();
  }, []);

  return (
    <div className="reservations-page">
      <h1>Reservations</h1>
      <table className="reservations-table">
        <thead>
          <tr>
            <th>Reservation ID</th>
            <th>Customer Name</th>
            <th>Movie Title</th>
            <th>Show Time</th>
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
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationsPage;
