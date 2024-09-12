import React, { useState } from "react";
import "./Seats.css";

// const predefinedLayouts = {
//   Classic: [
//     {
//       rowName: "A",
//       seats: Array.from({ length: 8 }, (_, index) => ({
//         seatNumber: index + 1,
//         status: "available",
//         price: 10,
//       })),
//     },
//     {
//       rowName: "B",
//       seats: Array.from({ length: 8 }, (_, index) => ({
//         seatNumber: index + 1,
//         status: "available",
//         price: 10,
//       })),
//     },
//   ],
//   VIP: [
//     {
//       rowName: "VIP1",
//       seats: Array.from({ length: 4 }, (_, index) => ({
//         seatNumber: index + 1,
//         status: "vip",
//         price: 50,
//       })),
//     },
//     {
//       rowName: "VIP2",
//       seats: Array.from({ length: 4 }, (_, index) => ({
//         seatNumber: index + 1,
//         status: "vip",
//         price: 50,
//       })),
//     },
//   ],
//   Balcony: [
//     {
//       rowName: "Balcony1",
//       seats: Array.from({ length: 10 }, (_, index) => ({
//         seatNumber: index + 1,
//         status: "available",
//         price: 20,
//       })),
//     },
//     {
//       rowName: "Balcony2",
//       seats: Array.from({ length: 10 }, (_, index) => ({
//         seatNumber: index + 1,
//         status: "available",
//         price: 20,
//       })),
//     },
//   ],
//   Circle: [], // Add Circle dynamically
//   Oval: [], // Add Oval dynamically
// };

// const SeatsPage = () => {
//   const [layout, setLayout] = useState("Classic");
//   const [rows, setRows] = useState(predefinedLayouts[layout]);
//   const [newRowName, setNewRowName] = useState("");
//   const [newRowSeats, setNewRowSeats] = useState(0);
//   const [newRowPrice, setNewRowPrice] = useState(0);
//   const [errorMessage, setErrorMessage] = useState(""); // For validation errors

//   // Handle layout selection
//   const handleLayoutChange = (e) => {
//     const selectedLayout = e.target.value;
//     setLayout(selectedLayout);
//     setRows(predefinedLayouts[selectedLayout] || []);
//   };

//   // Handle adding a new row
//   const handleAddRow = () => {
//     setErrorMessage(""); // Reset error message before validation
//     if (newRowName === "") {
//       setErrorMessage("Please enter a row name");
//       return;
//     }
//     if (newRowSeats <= 0) {
//       setErrorMessage("Please enter a valid number of seats");
//       return;
//     }

//     const newSeats = Array.from({ length: newRowSeats }, (_, index) => ({
//       seatNumber: index + 1,
//       status: "available",
//     }));
//     setRows([...rows, { rowName: newRowName, seats: newSeats }]);
//     setNewRowName("");
//     setNewRowSeats(0);
//   };

//   // Handle removing a row
//   const handleRemoveRow = (rowIndex) => {
//     const updatedRows = rows.filter((_, index) => index !== rowIndex);
//     setRows(updatedRows);
//   };

//   // Handle adding a seat to a row
//   const addSeatToRow = (rowIndex) => {
//     const updatedRows = [...rows];
//     const newSeat = {
//       seatNumber: updatedRows[rowIndex].seats.length + 1,
//       status: "available",
//       price: updatedRows[rowIndex].seats[0].price,
//     };
//     updatedRows[rowIndex].seats.push(newSeat);
//     setRows(updatedRows);
//   };

//   // Handle removing a seat from a row
//   const removeSeatFromRow = (rowIndex, seatIndex) => {
//     const updatedRows = [...rows];
//     updatedRows[rowIndex].seats.splice(seatIndex, 1);
//     setRows(updatedRows);
//   };

//   // Handle changing seat status
//   const changeSeatStatus = (rowIndex, seatIndex) => {
//     const updatedRows = [...rows];
//     const seat = updatedRows[rowIndex].seats[seatIndex];

//     // Toggle seat status
//     if (seat.status === "available") seat.status = "vip";
//     else if (seat.status === "vip") seat.status = "unavailable";
//     else seat.status = "available";
//     setRows(updatedRows);
//   };

//   return (
//     <div className="App">
//       <h1>Theatre Seat Management</h1>

//       <div className="layout-selector">
//         <label>Select Layout: </label>
//         <select value={layout} onChange={handleLayoutChange}>
//           <option value="Classic">Classic</option>
//           <option value="VIP">VIP</option>
//           <option value="Balcony">Balcony</option>
//           <option value="Circle">Circle</option>
//           <option value="Oval">Oval</option>
//         </select>
//       </div>

//       <div className="row-form">
//         <input
//           type="text"
//           placeholder="Row Name (e.g., A, B, C)"
//           value={newRowName}
//           onChange={(e) => setNewRowName(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Number of Seats"
//           value={newRowSeats}
//           onChange={(e) => setNewRowSeats(Number(e.target.value))}
//         />
//         <input
//           type="number"
//           placeholder="Seat Price"
//           value={newRowPrice}
//           onChange={(e) => setNewRowPrice(Number(e.target.value))}
//         />
//         <button onClick={handleAddRow}>Add Row</button>
//       </div>

//       <div className="seat-layout">
//         {rows.map((row, rowIndex) => (
//           <div
//             key={rowIndex}
//             className={`row ${
//               layout === "Circle" || layout === "Oval"
//                 ? layout.toLowerCase()
//                 : ""
//             }`}
//           >
//             <span>
//               {row.rowName} (Price: ${row.seats[0].price}):
//             </span>
//             {row.seats.map((seat, seatIndex) => (
//               <button
//                 key={seatIndex}
//                 className={`seat ${seat.status}`}
//                 onClick={() => changeSeatStatus(rowIndex, seatIndex)}
//               >
//                 {seat.seatNumber}
//               </button>
//             ))}
//             <button
//               className="add-seat-btn"
//               onClick={() => addSeatToRow(rowIndex)}
//             >
//               +
//             </button>
//             <button
//               className="remove-row-btn"
//               onClick={() => handleRemoveRow(rowIndex)}
//             >
//               Remove Row
//             </button>
//             <button
//               className="remove-seat-btn"
//               onClick={() => removeSeatFromRow(rowIndex, row.seats.length - 1)}
//             >
//               Remove Seat
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// Define initial layouts for different seating arrangements
const predefinedLayouts = {
  Classic: [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ],
  VIP: [
    [0, 1, 1, 1, 0],
    [1, 1, 2, 1, 1],
    [1, 1, 1, 1, 1],
  ],
  Balcony: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 1, 1, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

// Seat statuses for display
const SEAT_STATUSES = {
  0: "hidden",
  1: "empty",
  2: "reserved",
  3: "paid",
};

const SeatsPage = () => {
  const [layout, setLayout] = useState("Classic"); // Selected layout type
  const [seatLayout, setSeatLayout] = useState(predefinedLayouts[layout]);
  const [error, setError] = useState(null);

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
      currentStatus === 3 ? 0 : currentStatus + 1; // Cycle through statuses: hidden -> empty -> reserved -> paid -> back to hidden
    setSeatLayout(updatedLayout);
  };

  // Handle adding an entire row
  const handleAddRow = () => {
    // Check if the seatLayout exists and has rows
    if (seatLayout.length === 0) return;

    // Create a new row with the same number of seats as the current layout's rows
    const newRow = Array.from({ length: seatLayout[0].length }, () => 1); // 1 represents an empty seat

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

  // Render seat layout
  const sum = (arr) => {
    return arr.reduce((total, num) => total + num, 0);
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
          {row.map(
            (seat, seatIndex) => (
              console.log("seat", seat),
              console.log("seatIndex", seatIndex),
              (
                <button
                  key={seatIndex}
                  className={`seat ${SEAT_STATUSES[seat]}`}
                  onClick={() => changeSeatStatus(rowIndex, seatIndex)}
                >
                  {seat > 0 ? `${rowLabel}${seatCounter++}` : ""}
                  {/* Only show seat number for non-hidden seats */}
                </button>
              )
            )
          )}
          <button
            onClick={() => handleRemoveRow(rowIndex)}
            className="remove-row"
          >
            Remove Row
          </button>
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
          <option value="Classic">Classic</option>
          <option value="VIP">VIP</option>
          <option value="Balcony">Balcony</option>
        </select>
      </div>

      <div className="row-form">
        <button onClick={handleAddRow}>Add Row</button>
        <button onClick={handleAddColumn}>Add Column</button>
        <button onClick={handleRemoveColumn}>Remove Column</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      <div className="seat-layout">{renderSeatLayout()}</div>
    </div>
  );
};

export default SeatsPage;
