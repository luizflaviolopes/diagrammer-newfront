import React from "react";

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
    </React.Fragment>
  );
};

export const Demo = (props) => {
  return <circle cx={50} cy={50} r={50} opacity={1} />;
};

export default Circle;
