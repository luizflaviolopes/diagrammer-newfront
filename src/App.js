import React from "react";
import { addLotElements } from "./tests/addLotElements";
import { Router, Link } from "@reach/router";
import BoardPage from "./pages/BoardPage";
import LoginPage from "./authentication/pages/LoginPage";
import "./css/base.css";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import DiagramsBucket from "./pages/DiagramsBucket";

Amplify.configure(awsconfig);

function App() {
  window.addLotElements = addLotElements;

  return (
    <div className="App">
      <Router>
        <BoardPage default></BoardPage>
        <LoginPage path="/auth/*"></LoginPage>
        <DiagramsBucket path="/diagrams"></DiagramsBucket>
      </Router>
    </div>
  );
}

export default App;
