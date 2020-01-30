import React, { useState, useCallback } from "react";

const Line = props => {
  return (
    <line
      x1={props.from.x}
      y1={props.from.y}
      x2={props.to.x}
      y2={props.to.y}
      stroke="black"
      strokeWidth="3"
    />
  );
};

export default Line;
