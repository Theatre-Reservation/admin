import React from "react";
import "./Modal.css";

function Modal({ children, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-icon" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
}

export default Modal;
