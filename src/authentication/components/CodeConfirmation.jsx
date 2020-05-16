import React, { useState } from "react";
import { Link, useNavigate } from "@reach/router";
import { Auth } from "aws-amplify";
import ButtonWait from "./ButtonWait";

const CodeConfirmation = (props) => {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState([]);
  const [wait, setWait] = useState(false);

  const email = props.location.state.email;

  const navigate = useNavigate();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setWait(true);

    if (code.length > 0)
      Auth.confirmSignUp(email, code)
        .then((ret) => navigate("/auth"))
        .catch((err) => {
          if (err.code && err.code == "CodeMismatchException")
            setErrors([{ message: "Código inválido" }]);
          else {
            setErrors([
              {
                message:
                  "houve um problema ao validar o código, favor tentar novamente mais tarde",
              },
            ]);
            console.log("error: ", err);
          }
          setWait(false);
        });
    else {
      setErrors([{ message: "Código inválido" }]);
      setWait(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <span>Insira o código de confirmação enviado para seu e-mail</span>
      {errors.map((err) => (
        <p className="attribute-validation">{err.message}</p>
      ))}
      <input
        type="text"
        placeholder="CODE"
        onChange={(evt) => setCode(evt.target.value)}
      />
      <ButtonWait text="confirmar" wait={wait}></ButtonWait>
    </form>
  );
};

export default CodeConfirmation;
