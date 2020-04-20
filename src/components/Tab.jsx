import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

var color = "white";

const OuterDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${(props) => (props.show ? "320px" : "0")};
  background-color: ${(props) => props.color};
  opacity: 0.9;
  transition: width 0.1s linear;
`;

const SideTab = styled.div`
  position: absolute;
  left: 100%;
  top: 20%;
  background-color: ${(props) => props.color};
  width: 25px;
  height: ${(props) => props.length / 1.5 + "em"};
`;

const InnerDiv = styled.div`
  position: absolute;
  background-color: white;
  opacity: 0.5;
  top: 15px;
  left: 10px;
  right: 10px;
  bottom: 12px;
`;

const TabTitle = styled.label`
  color: white;
  text-orientation: unset;
  writing-mode: tb-rl;
  height: 100%;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
`;

const Tab = (props) => {
  const [isVisible, toggleVisible] = useState(false);

  color = props.color;

  return (
    <OuterDiv show={isVisible} color={props.color}>
      <SideTab
        onClick={(evt) => toggleVisible(!isVisible)}
        length={props.name.length}
        color={props.color}
      >
        <TabTitle>{props.name}</TabTitle>
      </SideTab>
      <InnerDiv>{props.childrens}</InnerDiv>
    </OuterDiv>
  );
};

export default Tab;
