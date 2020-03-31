import React from "react";

const Marker = () => {
  return (
    <defs>
      <marker
        xmlns="http://www.w3.org/2000/svg"
        id="triangle"
        viewBox="20 0 80 80"
        refX="80"
        refY="40"
        markerUnits="strokeWidth"
        markerWidth="10"
        markerHeight="10"
        orient="auto"
      >
        <path
          d="M 0 0 L 80 40 L 0 80"
          style={{
            fill: "none",
            strokeWidth: 9,
            stroke: "black",
            pointerEvents: "stroke"
          }}
        ></path>
      </marker>

      <marker
        id="dot"
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="5"
        markerHeight="5"
      >
        <circle cx="5" cy="5" r="5" fill="red" />
      </marker>
    </defs>
  );
};

export default Marker;
