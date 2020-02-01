import React from "react";

const Circle = props => {
  let fillColor = "white";

  if (props.highlightConnection) {
    fillColor = "steelblue";
  }

  return (
    <circle
      cx="0"
      cy="0"
      r={props.radius}
      stroke="black"
      strokeWidth="2"
      fill={fillColor}
    />
  );
};

export default Circle;
