import React from "react";
import "./Card.css"

function Card(props) {
  return (
    <div className="card">
      <div className="card-inner">
        <h3>{props.name}</h3>
        <props.icon className="card_icon" />
      </div>
      <h1>{props.value}</h1>
    </div>
  );
}

export default Card;
