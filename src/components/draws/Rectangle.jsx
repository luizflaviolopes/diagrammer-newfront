import React, { useState } from "react";
import EditableText from "../EditableText";

export const Demo = (props) => {
  return <rect x="0" y="0" height={100} width={100}></rect>;
};

const ResizeHitbox = (props) => {
  return (
    <rect
      opacity="0"
      cursor={props.corner + "-resize"}
      type="resizeAnchor"
      corners={props.corner}
      x={props.x}
      y={props.y}
      height="10"
      width="10"
      drawId={props.drawId}
    ></rect>
  );
};

const Rectangle = (props) => {
  const [text, setText] = useState(props.text);

  const handleChangeText = (newText) => {
    setText(newText);
  };

  return (
    <React.Fragment>
      <rect
        style={{ pointerEvents: props.pointerEvents }}
        id={props.id}
        x="0"
        y="0"
        height={props.height}
        width={props.width}
        stroke="none"
        fill={props.fillColor || "white"}
        draw="true"
        {...props.fillProperties}
      ></rect>
      <rect
        stroke="black"
        strokeWidth="3"
        fill="none"
        style={{ pointerEvents: props.pointerEvents }}
        x="0"
        y="0"
        height={props.height}
        width={props.width}
        {...props.strokeProperties}
      ></rect>
      {props.pointerEvents != "none" ? (
        <React.Fragment>
          <ResizeHitbox
            x="0"
            y="0"
            corner="nw"
            drawId={props.id}
          ></ResizeHitbox>
          <ResizeHitbox
            x={props.width - 10}
            y="0"
            corner="ne"
            drawId={props.id}
          ></ResizeHitbox>
          <ResizeHitbox
            x={props.width - 10}
            y={props.height - 10}
            corner="se"
            drawId={props.id}
          ></ResizeHitbox>
          <ResizeHitbox
            x="0"
            y={props.height - 10}
            corner="sw"
            drawId={props.id}
          ></ResizeHitbox>
          <EditableText
            elId={props.id}
            x={props.width / 2}
            y={5}
            width={props.width}
          >
            {props.text}
          </EditableText>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default Rectangle;
