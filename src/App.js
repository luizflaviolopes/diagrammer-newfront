import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Board from "./containers/Board";
import { addLotElements } from "./tests/addLotElements";

function App() {
  window.addLotElements = addLotElements;

  return (
    <div className="App">
      <Board></Board>
    </div>
  );
}

export default App;
