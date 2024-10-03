import React, { useState } from "react";
import axios from "../../axios";
import "./Seats.css";

// Define initial layouts for different seating arrangements
const predefinedLayouts = {
  Box: [
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  ],
  Round: [
    [0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0],
  ],
  Beem: [
    [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  ],
};

// Seat statuses for display
const SEAT_STATUSES = {
  0: "hidden",
  1: "empty",
  2: "reserved",
};

const SeatsPage = () => {
  // const { id } = useParams();

  const [layout, setLayout] = useState("Box"); // Selected layout type
  const [seatLayout, setSeatLayout] = useState(predefinedLayouts[layout]);
  const [error, setError] = useState(null);

  const handleSaveLayout = async (id) => {
    id = "66e71e5ed8b8a2a660fae78b";
    try {
      const response = await axios.patch(`movies/${id}/seats`, {
        seats: seatLayout,
      });
      console.log("Layout saved successfully:", response.data);
      setError(null);
    } catch (error) {
      console.error("Error saving layout:", error);
      setError("Failed to save layout. Please try again.");
    }
  };

  // Handle layout change
  const handleLayoutChange = (e) => {
    const selectedLayout = e.target.value;
    setLayout(selectedLayout);
    setSeatLayout(predefinedLayouts[selectedLayout]);
  };

  // Toggle seat status based on the value clicked
  const changeSeatStatus = (rowIndex, seatIndex) => {
    const updatedLayout = [...seatLayout];
    const currentStatus = updatedLayout[rowIndex][seatIndex];
    updatedLayout[rowIndex][seatIndex] =
      currentStatus === 2 ? 0 : currentStatus + 1; // Cycle through statuses: hidden -> empty -> reserved -> back to hidden
    setSeatLayout(updatedLayout);
  };

  // Handle adding an entire row
  const handleAddRow = () => {
    if (seatLayout.length === 0) return;
    // Create a new row with the same number of seats as the current layout's rows
    const newRow = Array.from({ length: seatLayout[0].length }, () => 1);
    // Append the new row to the current layout
    setSeatLayout([...seatLayout, newRow]);
  };

  // Handle adding a column to each row
  const handleAddColumn = () => {
    const updatedLayout = seatLayout.map((row) => [...row, 1]); // Add one seat (empty status) to each row
    setSeatLayout(updatedLayout);
  };

  // Handle removing a row
  const handleRemoveRow = (rowIndex) => {
    const updatedLayout = seatLayout.filter((_, index) => index !== rowIndex);
    setSeatLayout(updatedLayout);
  };

  // Handle removing a column
  const handleRemoveColumn = () => {
    if (seatLayout[0].length > 1) {
      const updatedLayout = seatLayout.map((row) => row.slice(0, -1)); // Remove the last seat from each row
      setSeatLayout(updatedLayout);
    }
  };

  const renderSeatLayout = () => {
    let rowCounter = 0;
    return seatLayout.map((row, rowIndex) => {
      // Filter out hidden seats (value 0) when calculating the row label
      const visibleSeats = row.filter((seat) => seat > 0);

      // If there are visible seats, assign a letter label for the row
      const rowLabel =
        visibleSeats.length > 0 ? String.fromCharCode(65 + rowCounter++) : "";

      // Track the seat number only for visible (non-hidden) seats
      let seatCounter = 1;

      return (
        <div key={rowIndex} className="row">
          <button
            onClick={() => handleRemoveRow(rowIndex)}
            className="remove-row"
          >
            Delete
          </button>
          {row.map((seat, seatIndex) => (
            // console.log("seat", seat),
            // console.log("seatIndex", seatIndex),
            <button
              key={seatIndex}
              className={`seat ${SEAT_STATUSES[seat]}`}
              onClick={() => changeSeatStatus(rowIndex, seatIndex)}
            >
              {seat > 0 ? `${rowLabel}${seatCounter++}` : ""}
            </button>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="App">
      <h1>Theatre Seat Management</h1>
      <div className="layout-selector">
        <label>Select Layout: </label>
        <select value={layout} onChange={handleLayoutChange}>
          <option value="Box">Box</option>
          <option value="Round">Round</option>
          <option value="Beem">Beem</option>
        </select>
      </div>

      <div className="seat-layer">
        <div className="row-form">
          <button className="add-column" onClick={handleAddColumn}>
            Add Column
          </button>
          <button className="remove-column" onClick={handleRemoveColumn}>
            Remove Column
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <div className="seat-layout">
          {renderSeatLayout()}
          <button className="add-row" onClick={handleAddRow}>
            Add Row
          </button>
        </div>
      </div>
      <button className="save" onClick={handleSaveLayout}>
        Save
      </button>
    </div>
  );
};

export default SeatsPage;
