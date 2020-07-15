import React, { useState, useRef } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { connect } from "react-redux";
import { changeDrawText } from "../actions/drawing";

const StyledInputText = styled.textarea`
  position: absolute;
  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
  width: ${(props) => props.position.width}px;
  resize: none;
  border: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  text-align: center;
  font-size: 15px;

  :hover {
    border: none;
    padding: 0;
    margin: 0;
    outline: 0;
  }
  :focus {
    border: none;
    padding: 0;
    margin: 0;
    outline: 0;
  }
  :active {
    border: none;
    padding: 0;
    margin: 0;
    outline: 0;
  }
`;

const EditableText = (props) => {
  const [coord, setCoord] = useState(null);

  const handleClick = (evt) => {
    const position = evt.target.getBoundingClientRect();
    position.x = position.x + position.width / 2 - props.width / 2;
    position.width = props.width;
    setCoord(position);
  };

  const finishEdit = () => {
    setCoord(null);
  };

  if (coord) {
    const input = (
      <ConnectedInputText
        position={coord}
        onFinish={finishEdit}
        elId={props.elId}
      >
        {props.children}
      </ConnectedInputText>
    );
    return ReactDOM.createPortal(input, document.getElementById("root"));
  }

  return (
    <text
      onClick={handleClick}
      text-anchor="middle"
      alignment-baseline="hanging"
      x={props.x}
      y={props.y}
      style={{ fontSize: "15px", fontFamily: "Arial" }}
    >
      {props.children}
    </text>
  );
};

const InputText = (props) => {
  const inputEl = useRef(null);

  useEffect(() => {
    console.log(inputEl);
    inputEl.current.focus();
  });

  const handleOnBlur = (evt) => {
    props.onFinish();
  };

  return (
    <StyledInputText
      ref={inputEl}
      position={props.position}
      style={{ fontFamily: "Arial", ...props.style }}
      value={props.children}
      onBlur={handleOnBlur}
      onChange={(evt) => {
        props.changeText({ id: props.elId, text: evt.target.value });
      }}
    ></StyledInputText>
  );
};

const ConnectedInputText = connect(null, { changeText: changeDrawText })(
  InputText
);

export default EditableText;
