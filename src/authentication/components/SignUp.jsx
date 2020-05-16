import React, { useState } from "react";
import { Link, useNavigate } from "@reach/router";
import { Auth } from "aws-amplify";
import "../../css/loginPage.css";
import customErrorMessages from "../helpers/customErrorMessages";
import ButtonWait from "./ButtonWait";

const SignUp = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [wait, setWait] = useState(false);
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const handleRegistration = (evt) => {
    evt.preventDefault();
    setWait(true);

    const attrName = name.length > 0 ? name : undefined;
    Auth.signUp({
      username: email,
      password,
      attributes: {
        name: attrName,
      },
    })
      .then((user) => navigate("confirm", { state: { email: email } }))
      .catch((error) => {
        const err = customErrorMessages(error.message);
        setErrors(err);
        console.log("error signing up:", error);
        setWait(false);
      });
  };

  return (
    <form onSubmit={handleRegistration}>
      {errors.map((err) => (
        <p className="attribute-validation">{err.message}</p>
      ))}
      <input
        type="text"
        placeholder="nome"
        onChange={(evt) => setName(evt.target.value)}
      />
      <input
        type="password"
        placeholder="senha"
        onChange={(evt) => setPassword(evt.target.value)}
      />
      <input
        type="text"
        placeholder="email"
        onChange={(evt) => setEmail(evt.target.value)}
      />
      <ButtonWait wait={wait} text="Cadastrar"></ButtonWait>
      <p className="message">
        Já registrado? <Link to="/auth">Entrar</Link>
      </p>
    </form>
  );
};

const mapErrors = (attr, errors) => {
  return errors
    .filter((el) => el.type == attr)
    .map((err) => <p className="attribute-validation">{err.message}</p>);
};

export default SignUp;
