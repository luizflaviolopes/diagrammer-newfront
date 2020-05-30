import React from "react";
import { Router, Link } from "@reach/router";
import BoardPage from "./pages/BoardPage";
import LoginPage from "./authentication/pages/LoginPage";
import "./css/base.css";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import DiagramsBucked from "./pages/DiagramsBucket";

Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
      <Router>
        <BoardPage path="/"></BoardPage>
        <LoginPage path="/auth/*"></LoginPage>
        <DiagramsBucked path="/diagrams"></DiagramsBucked>
      </Router>
    </div>
  );
}

export default App;
