import React from "react";
import { Auth } from "aws-amplify";
import { Link, useNavigate } from "@reach/router";
import conf from "../../config.js";
import Slot from "./Slot.jsx";
import styled from "styled-components";
import ButtonCreate from "./ButtonCreate.jsx";

const DiagramsListStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 20px;
  right: 10px;
  left: 100px;
  bottom: 10px;
`;

const DiagramsListPanel = (props) => {
  const handleCreateDiagram = async (evt) => {
    const user = await Auth.currentSession();
    console.log(user);

    fetch(conf.apiDomain + "diagrams", {
      // method: "post",
      headers: { Authorization: user.getIdToken().jwtToken },
    })
      .then((data) => data.json())
      .then((d) => console.log(d))
      .catch((err) => console.log(err));
  };

  return (
    <DiagramsListStyled>
      <Slot>
        <ButtonCreate></ButtonCreate>
      </Slot>
      <Slot></Slot>
      <Slot></Slot>
      <Slot></Slot>
      <Slot></Slot>
      <Slot></Slot>
      <Slot></Slot>
      <Slot></Slot>
      <Slot></Slot>
    </DiagramsListStyled>
  );
};

export default DiagramsListPanel;
