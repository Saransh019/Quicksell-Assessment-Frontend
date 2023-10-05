// import React, { useState } from "react";
import Card from "../Card/Card";
import Editable from "../Editabled/Editable";

import "./Board.css";

const ASC = 'ascending';
function sortByPriority(a, b, order = ASC) {
    const diff = a.priority - b.priority;

    if (order === ASC) {
        return diff;
    }

    return -1 * diff;
}

function sortByTitle(a, b, order = ASC) {
    if(a.title.length!=b.title.length) return a.title.length > b.title.length;
    const diff = a.title.toLowerCase().localeCompare(b.title.toLowerCase());

    if (order === ASC) {
        return diff;
    }

    return -1 * diff;
}


function Board(props) {
  // const [showDropdown, setShowDropdown] = useState(false);
  const sortPriority = props.sortPriority;

  // console.log(props.board?.cards?.sort(sortByTitle));   

  if(!sortPriority){
    props.board?.cards?.sort(sortByTitle)
  }
  else{
    props.board?.cards?.sort(sortByPriority)
  }

  return (
    <div className="board">
      <div className="board_header">
        <p className="board_header_title">
          {props.board?.title}
          <span>{props.board?.cards?.length || 0}</span>
        </p>
        {/* <div
          className="board_header_title_more"
          onClick={() => setShowDropdown(true)}
        >
          <MoreHorizontal />
          {showDropdown && (
            <Dropdown
              class="board_dropdown"
              onClose={() => setShowDropdown(false)}
            >
              <p onClick={() => props.removeBoard()}>Delete Board</p>
            </Dropdown>
          )}
        </div> */}
      </div>
      <div className="board_cards custom-scroll">
        {props.board?.cards?.map((item) => (
          <Card 
            key={item.id}
            desc={item.desc}
            card={item}
            boardId={props.board.id}
            removeCard={props.removeCard}
            dragEntered={props.dragEntered}
            dragEnded={props.dragEnded}
            updateCard={props.updateCard}
          />
          
        ))}
        <Editable
          text="+ Add Card"
          placeholder="Enter Card Title"
          displayClass="board_add-card"
          editClass="board_add-card_edit"
          onSubmit={(value) => props.addCard(props.board?.id, value)}
        />
      </div>
    </div>
  );
}

export default Board;
