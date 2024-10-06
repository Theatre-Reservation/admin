import React from "react";

function EventRow({ event, onEdit, onDelete }) {
  return (
    <tr>
      <td>{event.title}</td>
      <td>{event.venue}</td>
      <td>{event.date.split("T")[0]}</td>
      <td>{event.runtime}</td>
      <td>{event.time}</td>
      <td>{event.price}</td>
      <td className="edit-delete-btns">
        <button className="edit-btn" onClick={onEdit}>
          Edit
        </button>
        <button className="delete-btn" onClick={onDelete}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default EventRow;
