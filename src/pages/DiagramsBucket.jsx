import React from "react";
import { Auth } from "aws-amplify";
import { Link, useNavigate } from "@reach/router";
import conf from "../config.js";
import { json } from "d3";
import Slot from "../components/DiagramsBucket/Slot.jsx";
import styled from "styled-components";
import ButtonCreate from "../components/DiagramsBucket/ButtonCreate.jsx";

const BucketPanelStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  top: 20px;
  right: 10px;
  left: 10px;
  bottom: 10px;
`;

const DiagramsBucked = (props) => {
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
    <BucketPanelStyled>
      <Slot></Slot>
      <Slot></Slot>
      <Slot></Slot>
      <Slot></Slot>
      <Slot>
        <ButtonCreate></ButtonCreate>
      </Slot>
      <Slot></Slot>
      <Slot></Slot>
      <Slot></Slot>
      <Slot></Slot>
    </BucketPanelStyled>
  );
};

export default DiagramsBucked;
