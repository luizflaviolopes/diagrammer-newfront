import React from "react";
import EditableText from "../EditableText";

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

const Circle = (props) => {
  const CalcCirclePoints = () => {
    const initialPoint = { x: 0, y: props.height / 2 };

    const firstSemiCircle = ` a ${props.width / 2},${props.height / 2} 0 1,0 ${
      props.width
    },0`;

    const secondSemiCircle = ` a ${props.width / 2},${
      props.height / 2
    } 0 1,0 ${-props.width},0`;

    const path =
      `M ${initialPoint.x},${initialPoint.y}` +
      firstSemiCircle +
      secondSemiCircle;

    return path;
  };

  const pathPoints = CalcCirclePoints();

  return (
    <React.Fragment>
      <path
        style={{ pointerEvents: props.pointerEvents }}
        id={props.id}
        d={pathPoints}
        stroke="none"
        fill={props.fillColor || "white"}
        draw="true"
        {...props.fillProperties}
      ></path>
      <path
        stroke="black"
        strokeWidth="3"
        fill="none"
        style={{ pointerEvents: props.pointerEvents, cursor: "n-resize" }}
        d={pathPoints}
        {...props.strokeProperties}
      ></path>
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
            y={props.height / 2 - ((props.height / 2) * Math.sqrt(2)) / 2}
            width={(props.width / 2) * Math.sqrt(2)}
          >
            {props.text}
          </EditableText>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export const Demo = (props) => {
  return <circle cx={50} cy={50} r={50} opacity={1} />;
};

export default Circle;
