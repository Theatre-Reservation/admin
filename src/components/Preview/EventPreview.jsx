import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "./Preview.css";

function EventPreview(props) {
  const [event, setEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`/events/${props.id}`).then((res) => setEvent(res.data));
  }, [props.id, isModalOpen]);

  console.log(event);

  if (!event) {
    return <div>Loading...</div>;
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button className="view-btn" onClick={openModal}>
        View
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h1>{event.title}</h1>
              <span className="close-icon" onClick={closeModal}>
                &times;
              </span>
            </div>
            {/* Event Details Inside Modal */}
            <div className="event-container">
              <div className="event-poster">
                <img src={event.poster_path} alt={event.title} />
              </div>
              <div className="event-details">
                <h1 className="event-title">{event.title}</h1>
                <p className="event-description">{event.description}</p>
                <div className="event-info">
                  <p>
                    <strong>Venue:</strong> {event.venue}
                  </p>
                  <p>
                    <strong>Date:</strong> {event.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {event.time}
                  </p>
                  <p>
                    <strong>Runtime:</strong> {event.runtime}
                  </p>
                  <p>
                    <strong>Ticket Price:</strong> LKR{" "}
                    {event.ticket_price.toFixed(2)}
                  </p>
                  {/* {true && (
                    <div className="ticket-control">
                      <div className="ticket-heading">Select Tickets:</div>
                      <div className="ticket-selection">
                        <button
                          onClick={decrementTickets}
                          className="ticket-change-btn"
                        >
                          -
                        </button>
                        <span className="ticket-count">{ticketCount}</span>
                        <button
                          onClick={incrementTickets}
                          className="ticket-change-btn"
                        >
                          +
                        </button>
                      </div>
                      <div className="total-and-proceed">
                        <div className="total-amount">
                          <div>Total Amount:</div>
                          <div>LKR {totalPrice}</div>
                        </div>
                        <button className="proceed-btn">Proceed</button>
                      </div>
                    </div>
                  )}
                  {!showTicketSelector && (
                    <button onClick={handleBookNow} className="book-now-btn">
                      Book Now
                    </button>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventPreview;
