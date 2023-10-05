import React, { useState } from "react";

import "./Card.css";
import CardInfo from "./CardInfo/CardInfo";

function Card(props) {
  const [showModal, setShowModal] = useState(false);

  const { id, title,desc,tag,priority} = props.card;
  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={props.card}
          boardId={props.boardId}
          updateCard={props.updateCard}
        />
      )}
      <div
        className="card"
        draggable
        onDragEnd={() => props.dragEnded(props.boardId, id)}
        onDragEnter={() => props.dragEntered(props.boardId, id)}
      >

        <div className="card_title">{title}</div>
        <div className="card_desc">{desc}</div>
        <div className="card_tag">
          <div className="feature_bullet"></div>
          <div className="card_tag">Feature Request</div>
        </div>
        <div className="card_tag">Priority : {priority}</div>


              
      </div>
    </>
  );
}

export default Card;
