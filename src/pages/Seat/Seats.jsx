import React, { useState } from "react";
import "./Seats.css";

const SeatsPage = () => {
  // Define the rows and columns for the seat matrix
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Initialize the seats with unique IDs and a selected status
  const initialSeats = rows.flatMap((row) =>
    columns.map((column) => ({
      id: `${row}${column}`,
      selected: false,
    }))
  );

  const [seats, setSeats] = useState(initialSeats);

  // Toggle the selection state of a seat
  const toggleSeatSelection = (id) => {
    const updatedSeats = seats.map((seat) =>
      seat.id === id ? { ...seat, selected: !seat.selected } : seat
    );
    setSeats(updatedSeats);
  };

  return (
    <div className="seats-page">
      <h1>Select Seats</h1>
      <div className="seats-grid">
        {rows.map((row) => (
          <div key={row} className="seat-row">
            {columns.map((column) => {
              const seatId = `${row}${column}`;
              const seat = seats.find((seat) => seat.id === seatId);
              return (
                <div
                  key={seatId}
                  className={`seat ${seat.selected ? "selected" : ""}`}
                  onClick={() => toggleSeatSelection(seatId)}
                >
                  {seatId}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatsPage;
