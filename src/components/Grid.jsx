import React from "react";
import { connect } from "react-redux";

const Grid = props => {
  return (
    <React.Fragment>
      <defs>
        <pattern
          id="smallGrid"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect
            width="10"
            height="10"
            fill="none"
            stroke="gray"
            strokeWidth="0.3"
          />
        </pattern>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect
            width="40"
            height="40"
            fill="url(#smallGrid)"
            stroke="gray"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect
        transform={`translate(${props.offsetX % 40},${props.offsetY % 40})`}
        id="surface"
        x="-40"
        y="-40"
        width="2000"
        height="2000"
        fill="url(#grid)"
        onDoubleClick={props.onDoubleClick}
      />
    </React.Fragment>
  );
};

export default Grid;
