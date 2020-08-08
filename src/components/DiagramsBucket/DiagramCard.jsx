import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "@reach/router";
import IconButton from "./IconButton";
import { FaTrashAlt } from "react-icons/fa";
import Modal, { Header, Footer } from "../shared/modalComponents";
import { BasicInput } from "../shared/inputs";
import { RedButton } from "../shared/buttons";
import { deleteDiagram } from "../../comunication/diagramsController";

const StyledCard = styled.div`
  position: relative;
  cursor: pointer;

  :hover div.title > div {
    visibility: visible;
    animation: slideDown 0.25s ease-out;
  }
  :hover div.options {
    visibility: visible;
    animation: slideLeft 0.25s ease-out;
  }
  div.title {
    font-size: larger;
    overflow: hidden;
    text-align: center;
  }
  div.title > div {
    padding: 7px;
    visibility: hidden;
    background-color: rgb(183, 180, 77, 0.8);
    color: white;
  }
  div.options {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 35px;
    color: white;
    display: flex;
    align-items: center;
    text-align: center;
    flex-direction: row;
    visibility: hidden;

    > div {
      display: inline-block;
      background-color: black;
    }
    > buttons {
      padding-right: 10px;
    }
  }
  .flagEnd {
    height: 11px;
    width: 0;
    border-width: 23px 28px 0px 0px;
    border-style: solid;
    border-color: white black white white;
  }
`;

const DeleteModal = ({ name, closeAction, diagramId }) => {
  const [checkName, setCheckName] = useState("");
  const [alert, setAlert] = useState(null);
  const [waiting, setWaiting] = useState(true);

  const handleClick = (evt) => {
    evt.preventDefault();
    setWaiting(true);
    if (checkName.toLowerCase() != name.toLowerCase()) {
      setAlert("o nome do diagrama não confere");
      setWaiting(false);
      return;
    }

    deleteDiagram(diagramId).then(() => {
      window.location.reload();
    });
  };

  return (
    <Modal closeAction={closeAction}>
      <Header>Exclusão</Header>
      <h1>Excluir o diagrama "{name}"?</h1>
      <p>
        Se você tem certeza da exclusão do diagrama "{name}", basta escrever o
        nome do diagrama abaixo
      </p>
      <form onSubmit={handleClick}>
        <BasicInput
          onChange={(evt) => {
            setCheckName(evt.target.value);
          }}
        />
        <RedButton
          disabled={checkName.toLowerCase() != name.toLowerCase()}
          waiting={waiting}
        >
          Excluir
        </RedButton>
      </form>
      <span style={{ color: "red" }}>{alert}</span>
    </Modal>
  );
};

const DiagramCard = (props) => {
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);

  const handleClick = (evt) => {
    navigate(`/board/${props.boardId}`);
  };

  return (
    <StyledCard>
      <div className="title" onClick={handleClick}>
        <div>{props.name}</div>
      </div>
      <div className="options">
        <div className="flagEnd"></div>
        <div className="buttons">
          <IconButton
            icon={FaTrashAlt}
            style={{ margin: "0.2em", padding: "0.2em" }}
            onClick={() => {
              setDeleting(true);
            }}
          ></IconButton>
        </div>
      </div>

      {deleting && (
        <DeleteModal
          name={props.name}
          diagramId={props.boardId}
          closeAction={() => setDeleting(false)}
        />
      )}
    </StyledCard>
  );
};

export default DiagramCard;
