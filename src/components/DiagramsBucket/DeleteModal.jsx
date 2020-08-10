import React, { useState } from "react";

import Modal, { Header, Footer } from "../shared/modalComponents";
import { BasicInput } from "../shared/inputs";
import { RedButton } from "../shared/buttons";
import { deleteDiagram } from "../../comunication/diagramsController";

const DeleteModal = ({ name, closeAction, diagramId }) => {
  const [checkName, setCheckName] = useState("");
  const [alert, setAlert] = useState(null);
  const [waiting, setWaiting] = useState(false);

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

export default DeleteModal;
