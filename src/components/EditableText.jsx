import React, { useState, useRef } from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { connect } from "react-redux";
import { changeDrawText } from "../actions/drawing";

const StyledInputText = styled.input`
  position: absolute;
  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const EditableText = (props) => {
  const [coord, setCoord] = useState(null);

  const handleClick = (evt) => {
    const position = evt.target.getBoundingClientRect();
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
      style={props.style}
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
