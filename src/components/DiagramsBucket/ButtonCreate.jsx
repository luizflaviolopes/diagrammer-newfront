import React from "react";
import styled from "styled-components";
import { FaPlusSquare } from "react-icons/fa";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import "../../css/animations.css";
import IconButton from "./IconButton";
import api from "../../tools/api";

const ButtonCreateStyled = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgb(183, 180, 77);
  font-size: xx-large;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  cursor: ${(props) => (props.cover ? "pointer" : "auto")};
`;

const ButtonCreate = (props) => {
  const [cover, showCover] = useState(true);
  const [form, showForm] = useState(false);

  const handleOpenForm = (evt) => {
    showCover(false);
  };
  const handleCloseForm = (evt) => {
    showForm(false);
  };

  return (
    <div>
      <ButtonCreateStyled cover={cover} onClick={handleOpenForm}>
        <Cover in={cover} onExited={() => showForm(true)}></Cover>
        <FormNewDiagram
          in={form}
          onCancel={handleCloseForm}
          onExited={() => showCover(true)}
        ></FormNewDiagram>
      </ButtonCreateStyled>
    </div>
  );
};

const Cover = (props) => {
  return (
    <CSSTransition
      in={props.in}
      timeout={200}
      classNames="fade"
      unmountOnExit
      onExited={props.onExited}
    >
      <div>
        <div>
          <FaPlusSquare></FaPlusSquare>
        </div>
        Novo Diagrama
      </div>
    </CSSTransition>
  );
};

const InputNameStyled = styled.div`
  position: relative;
  padding: 15px 0 0;
  margin-top: 10px;
  width: 100%;
  font-family: "Poppins", sans-serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;

  > input {
    font-family: inherit;
    width: 100%;
    border: 0;
    border-bottom: 2px solid white;
    outline: 0;
    font-size: 1.3rem;
    color: white;
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;
    text-align: left;

    ::placeholder {
      color: transparent;
    }
    :placeholder-shown ~ label {
      font-size: 1.3rem;
      cursor: text;
      top: 20px;
    }
  }

  > label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: white;
  }

  input:focus {
    ~ label {
      position: absolute;
      top: 0;
      display: block;
      transition: 0.2s;
      font-size: 1rem;
      color: white;
      font-weight: 700;
    }
    padding-bottom: 6px;
    font-weight: 700;
    border-width: 3px;
  }
  /* reset input */
  label {
    &:required,
    &:invalid {
      box-shadow: none;
    }
  }
`;

const FormNewDiagram = (props) => {
  const [name, setName] = useState();

  const handleCreateDiagram = async (evt) => {
    api.post("diagrams/create", { name: name }).then();
  };

  return (
    <CSSTransition
      in={props.in}
      timeout={200}
      classNames="fade"
      unmountOnExit
      onExited={props.onExited}
    >
      <div>
        <InputNameStyled>
          <input
            type="input"
            placeholder="Nome"
            name="diagramName"
            id="diagramName"
            required
            value={name}
            onChange={(evt) => setName(evt.target.value)}
          />
          <label for="diagramName">Nome</label>
        </InputNameStyled>
        <IconButton
          icon={AiOutlineCheckCircle}
          size="larger"
          style={{ display: "inline-block" }}
          onClick={handleCreateDiagram}
        ></IconButton>
        <IconButton
          icon={AiOutlineCloseCircle}
          size="larger"
          style={{ display: "inline-block" }}
          onClick={props.onCancel}
        ></IconButton>
      </div>
    </CSSTransition>
  );
};

export default ButtonCreate;
