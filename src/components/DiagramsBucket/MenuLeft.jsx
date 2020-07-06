import React from "react";
import styled from "styled-components";
import { FaPlusSquare, FaUserCircle } from "react-icons/fa";
import { BsViewList } from "react-icons/bs";
import IconButton from "./IconButton";

const MenuPanelStyled = styled.div`
  width: 90px;
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  > .title {
    margin: 10px 5px;
    font-size: small;
  }
  > hr {
    width: 80%;
  }
  > .borderEnd {
    height: 0;
    width: 20px;
    border-width: 74px 70px 0px 0px;
    border-style: solid;
    background-color: green;
    border-color: black white white white;
  }
  div.buttons {
    font-size: xx-large;
  }
`;

const MeuLeft = (props) => {
  return (
    <MenuPanelStyled>
      <div className="title">Sistema de Diagramação</div>
      <hr></hr>
      <div className="buttons">
        <IconButton icon={BsViewList}></IconButton>
        <IconButton icon={FaUserCircle}></IconButton>
      </div>
      <div className="borderEnd"></div>
    </MenuPanelStyled>
  );
};

export default MeuLeft;
