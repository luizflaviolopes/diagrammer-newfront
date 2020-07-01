import React from "react";
import { Router } from "@reach/router";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import CodeConfirmation from "../components/CodeConfirmation";

const LoginPage = (props) => {
  return (
    <div className="login-background full-vh">
      <div className="login-page">
        <div className="form">
          <Router>
            <Login path="/" />
            <SignUp path="/signup" />
            <CodeConfirmation path="/confirm" />
          </Router>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
