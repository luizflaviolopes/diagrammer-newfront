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
  height: ${(props) => props.position.height}px;
  overflow: hidden;
  resize: none;
  border: none;
  padding: 0;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 15px;
  white-space: pre;

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
    const position = evt.currentTarget.getBoundingClientRect();
    position.x = position.x;
    position.width = position.width;
    position.height = position.height;
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
    <g onClick={handleClick}>
      {props.children
        //.match(new RegExp(`[\\s\\S]{1,${Math.floor(props.width / 10)}}`, "g"))
        .split("\n")
        .map((line, i) => {
          return (
            <text
              key={i}
              textAnchor="middle"
              alignmentBaseline="hanging"
              x={props.x}
              y={props.y + i * 16}
              style={{
                fontSize: "15px",
                fontFamily: "Arial",
                userSelect: "none",
              }}
            >
              {line}
            </text>
          );
        })}
    </g>
  );
};

const InputText = (props) => {
  const inputEl = useRef(null);

  const [position, setPosition] = useState(props.position);

  useEffect(() => {
    inputEl.current.focus();
    textSizing();
  }, []);

  const handleOnChange = (evt) => {
    textSizing();
    props.changeText({ id: props.elId, text: evt.target.value });
  };

  const textSizing = () => {
    const txtArea = inputEl.current;

    const newHeight = txtArea.scrollHeight;
    const newWidth = txtArea.scrollWidth + 2;

    let widthDiff = newWidth - props.position.width;

    const newX = props.position.x - widthDiff / 2;

    setPosition({
      height: newHeight,
      width: newWidth,
      x: newX,
      y: props.position.y,
    });
  };

  const handleOnBlur = (evt) => {
    props.onFinish();
  };

  return (
    <StyledInputText
      ref={inputEl}
      position={position}
      style={{ fontFamily: "Arial", ...props.style }}
      value={props.children}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
    ></StyledInputText>
  );
};

const ConnectedInputText = connect(null, { changeText: changeDrawText })(
  InputText
);

export default EditableText;
