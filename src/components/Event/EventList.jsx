import React from "react";
import EventRow from "./EventRow";

function EventList({ events, onEdit, onDelete }) {
  return (
    <table className="events-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Venue</th>
          <th>Date</th>
          <th>Runtime</th>
          <th>Time</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <EventRow
            key={event._id}
            event={event}
            onEdit={() => onEdit(event._id)}
            onDelete={() => onDelete(event._id)}
          />
        ))}
      </tbody>
    </table>
  );
}

export default EventList;
