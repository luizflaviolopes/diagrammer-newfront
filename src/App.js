import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Board from "./containers/Board";
import DrawListTab from "./components/DrawListTab";

function App() {
  return (
    <div className="App">
      <Board></Board>
      <DrawListTab></DrawListTab>
    </div>
  );
}

export default App;
