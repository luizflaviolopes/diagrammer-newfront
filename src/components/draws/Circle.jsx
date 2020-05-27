import React from "react";

const Circle = (props) => {
  const radius =
    props.width > props.height ? props.width / 2 : props.height / 2;

  return (
    <React.Fragment>
      <circle
        style={{ pointerEvents: props.pointerEvents }}
        id={props.id}
        cx={radius}
        cy={radius}
        r={radius}
        stroke="none"
        fill={props.fillColor || "white"}
        draw="true"
        {...props.fillProperties}
      ></circle>
      <circle
        stroke="black"
        strokeWidth="3"
        fill="none"
        style={{ pointerEvents: props.pointerEvents, cursor: "n-resize" }}
        cx={radius}
        cy={radius}
        r={radius}
        {...props.strokeProperties}
      ></circle>
    </React.Fragment>
  );
};

export const Demo = (props) => {
  return <circle cx={50} cy={50} r={50} opacity={1} />;
};

export default Circle;
