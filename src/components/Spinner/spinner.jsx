import React from "react";
import "./spinner.css";

const Spinner = ({ size = "20px" }) => {
  const spinnerStyle = {
    width: size,
    height: size,
  };

  return (
    <div className="spinner" style={spinnerStyle}>
      <div className="spinner-inner" style={spinnerStyle}></div>
    </div>
  );
};

export default Spinner;
