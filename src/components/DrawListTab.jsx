import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import Tab from "./Tab";
import Draws from "./draws/Demos";

import * as actions from "../actions/tabDrawListBoxActions";
import { onDragStart } from "../Listeners/mouse/draggingDrawListBlock";

const strokeWidth = 2;

const DrawBlockStyled = styled.svg`
  width: 100px;
  height: 100px;
  padding: 10px;
  margin: 10px;
  background-color: ${(props) =>
    props.selected ? "rgba(255, 255, 255, 0.2)" : "none"};
  :hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  > * {
    fill: none;
    stroke: black;
    stroke-width: ${strokeWidth};
  }
`;

const DrawBlock = (props) => {
  const viewBoxData = `${-strokeWidth} ${-strokeWidth} ${
    100 + strokeWidth * 2
  } ${100 + strokeWidth * 2}`;

  const onClickHandler = (evt) => {
    props.changeSelection({ selected: props.type });
  };

  return (
    <DrawBlockStyled
      viewBox={viewBoxData}
      selected={props.selected}
      onClick={onClickHandler}
      type={props.type}
      onMouseDown={onDragStart}
    >
      {props.children}
    </DrawBlockStyled>
  );
};

const DrawListBlocks = connect(
  (state) => ({ selected: state.elements.drawListBoxSelection }),
  { changeSelected: actions.changeSelected }
)((props) => {
  const allDraws = Object.keys(Draws);

  return allDraws.map((draw) => {
    const Draw = Draws[draw];
    return (
      <DrawBlock
        key={Draw.type}
        selected={props.selected == Draw.type}
        changeSelection={props.changeSelected}
        type={Draw.type}
      >
        <Draw.component></Draw.component>
      </DrawBlock>
    );
  });
});

const DrawListTab = (props) => {
  //console.log(Object.keys(Draws));
  return (
    <Tab name="Lista de desenhos" color="rgb(70, 70, 146)">
      <DrawListBlocks></DrawListBlocks>
    </Tab>
  );
};

export default DrawListTab;
