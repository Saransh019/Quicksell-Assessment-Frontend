import React, { useEffect, useState } from "react";

import Board from "./Components/Board/Board";

import "./App.css";
import Editable from "./Components/Editabled/Editable";

function App() {
  const [data, setData] = useState(null);
  const [sortPriority, setSortPriority] = useState(false);

  useEffect(() => {
    // Fetch data from the API and store it in the 'data' state
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((responseData) => handleData(responseData))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const [user_board, set_user_board] = useState([]);
  const [priority_board, set_priority_board] = useState([]);
  const [status_board, set_status_board] = useState([]);
  const priority_map = {
    0 : "No Priority",
    1 : "Low",
    2 : "medium",
    3 : "High",
    4 : "Urgent"
  };

  const handleData = (responseData) => {
    console.log(responseData);
    setData(responseData);
    {
      responseData.tickets.map((ticket) => {
        var uindex = user_board.findIndex(
          (item) => item.title === ticket.userId
        );
        if (uindex != -1) {
          addCardss(ticket.userId, user_board, ticket, set_user_board);
        } else {
          let tempBoards = user_board;
          let idd = Date.now() + Math.random() * 2;
          tempBoards.push({
            id: idd,
            title: ticket.userId,
            cards: [],
          });
          set_user_board(tempBoards);
          addCardss(ticket.userId, user_board, ticket, set_user_board);
        }

        var sindex = status_board.findIndex(
          (item) => item.title === ticket.status
        );
        if (sindex != -1) {
          addCardss(ticket.status, status_board, ticket, set_status_board);
        } else {
          let tempBoards = status_board;
          let idd = Date.now() + Math.random() * 2;
          tempBoards.push({
            id: idd,
            title: ticket.status,
            cards: [],
          });
          set_status_board(tempBoards);
          addCardss(ticket.status, status_board, ticket, set_status_board);
        }

        var pindex = priority_board.findIndex(
          (item) => item.title === priority_map[ticket.priority]
        );
        if (pindex != -1) {
          addCardss(
            priority_map[ticket.priority],
            priority_board,
            ticket,
            set_priority_board
          );
        } else {
          let tempBoards = priority_board;
          let idd = Date.now() + Math.random() * 2;
          tempBoards.push({
            id: idd,
            title:  priority_map[ticket.priority],
            cards: [],
          });
          set_priority_board(tempBoards);
          addCardss(
            priority_map[ticket.priority],
            priority_board,
            ticket,
            set_priority_board
          );
        }
      });
    }
  };

  const addCardss = (name, board, card, set_board) => {
    console.log("red", name, board, card);
    const index = board.findIndex((item) => item.title == name);
    console.log(index);
    if (index < 0) return;
    let tempBoards = [...board];
    console.log("reached");
    // console.log(...card, "erere");
    const obj = {
      id: Date.now() + Math.random() * 2,
      title: card.id,
      desc: card.title,
      user: card.userId,
      status: card.status,
      tag: card.tag[0],
      priority: card.priority,
    };
    console.log("onject", obj);
    tempBoards[index].cards.push(obj);
    set_board(tempBoards);
  };

  const [boards, setBoards] = useState(status_board);

  // console.log(data);

  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });

  const addboardHandler = (name) => {
    const tempBoards = [...boards];
    tempBoards.push({
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
    });
    setBoards(tempBoards);
  };

  const removeBoard = (id) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards.splice(index, 1);
    setBoards(tempBoards);
  };

  const addCardHandler = (id, titlee, descc, user, status, tag, priority) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;
    // console.log(descc);
    const tempBoards = [...boards];
    tempBoards[index].cards.push({
      id: Date.now() + Math.random() * 2,
      title: titlee,
      desc: descc,
      user,
      status,
      tag,
      priority,
    });
    setBoards(tempBoards);
  };

  const removeCard = (bid, cid) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoards);
  };

  const dragEnded = (bid, cid) => {
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    s_boardIndex = boards.findIndex((item) => item.id === bid);
    if (s_boardIndex < 0) return;

    s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => item.id === cid
    );
    if (s_cardIndex < 0) return;

    t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
    if (t_boardIndex < 0) return;

    t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cid
    );
    if (t_cardIndex < 0) return;

    const tempBoards = [...boards];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    setBoards(tempBoards);

    setTargetCard({
      bid: "",
      cid: "",
    });
  };

  const dragEntered = (bid, cid) => {
    if (targetCard.cid === cid) return;
    setTargetCard({
      bid,
      cid,
    });
  };

  const updateCard = (bid, cid, card) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;

    setBoards(tempBoards);
  };

  useEffect(() => {
    localStorage.setItem("prac-kanban", JSON.stringify(boards));
  }, [boards]);

  function abbc() {
    // console.log("fsadfad");
    setSortPriority(true);
  }
  function bbbc() {
    // console.log("dsffsfs");
    setSortPriority(false);
  }
  function setUser() {
    setBoards(user_board);
  }
  function setPriority() {
    setBoards(priority_board);
  }
  function setStatus() {
    setBoards(status_board);
  }

  return (
    <div className="app">
      <div className="app_nav">
        <h1>Quicksell</h1>
        <br></br>
        <h3>Saransh Bansal</h3>
        <br></br>

        <select name="language" id="language" className="dropdownn">
          <option value="Sorting" disabled selected>
            Sorting
          </option>
          <option value="Name" onClick={bbbc}>
            Name
          </option>
          <option value="Priority" onClick={abbc}>
            Priority
          </option>
        </select>

        <select name="language" id="language" className="dropdownn">
          <option value="Grouping" disabled selected>
            Grouping
          </option>
          <option value="User" onClick={setUser}>
            User
          </option>
          <option value="Status" onClick={setStatus}>
            Status
          </option>
          <option value="Priority" onClick={setPriority}>
            Priority
          </option>
        </select>
      </div>
      <div className="app_boards_container">
        <div className="app_boards">
          {boards.map((item) => (
            <Board
              key={item.id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item.id)}
              removeCard={removeCard}
              dragEnded={dragEnded}
              dragEntered={dragEntered}
              updateCard={updateCard}
              sortPriority={sortPriority}
            />
          ))}
          <div className="app_boards_last">
            <Editable
              displayClass="app_boards_add-board"
              editClass="app_boards_add-board_edit"
              placeholder="Enter Board Name"
              text="Add Board"
              buttonText="Add Board"
              onSubmit={addboardHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
