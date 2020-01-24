import React from "react";

const Circle = props => {
  return (
    <circle
      cx="0"
      cy="0"
      r={props.radius}
      stroke="black"
      strokeWidth="2"
      fill="white"
    />
  );
};

export default Circle;
