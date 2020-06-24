import React, { useState } from "react";
import { Link, useNavigate } from "@reach/router";
import { Auth } from "aws-amplify";
import ButtonWait from "./ButtonWait";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [wait, setWait] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (evt) => {
    evt.preventDefault();

    if (!userName || !password)
      setErrors([
        {
          message:
            "É necessário incluir seu e-mail e senha para realizar o login",
        },
      ]);

    setWait(true);

    try {
      const user = await Auth.signIn(userName, password);
      //console.log(user);
      navigate("/diagrams");
    } catch (error) {
      if (error.code == "NotAuthorizedException")
        setErrors([
          {
            message: "Usuário ou senha inválido",
          },
        ]);

      //console.log("error signing in", error);
      setWait(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      {errors.map((err) => (
        <p className="attribute-validation">{err.message}</p>
      ))}
      <input
        id="email"
        type="text"
        placeholder="e-mail"
        onChange={(evt) => setUserName(evt.target.value)}
      />
      <input
        id="password"
        type="password"
        placeholder="senha"
        onChange={(evt) => setPassword(evt.target.value)}
      />
      <ButtonWait text="login" wait={wait} />
      <p className="message">
        Não registrado? <Link to="/auth/signup">Crie uma conta</Link>
      </p>
    </form>
  );
};

export default Login;
