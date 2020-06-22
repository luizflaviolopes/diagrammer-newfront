import React from "react";
import { Auth } from "aws-amplify";
import { Link, useNavigate } from "@reach/router";
import conf from "../../config.js";
import api from "../../tools/api.js";
import Slot from "./Slot.jsx";
import styled from "styled-components";
import ButtonCreate from "./ButtonCreate.jsx";
import { useEffect } from "react";

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
  useEffect(() => {
    fillDiagrams();
  });

  const fillDiagrams = () => {
    api.get("diagrams").then((a) => console.log(a));
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
