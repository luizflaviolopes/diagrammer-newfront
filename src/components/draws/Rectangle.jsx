import React from "react";

const Rectangle = props => {
  let fillColor = "white";

  if (props.highlightConnection) {
    fillColor = "steelblue";
  }

  return (
    <React.Fragment>
      <rect
        x="0"
        y="0"
        height={props.heigth}
        width={props.width}
        stroke="black"
        strokeWidth="2"
        fill={fillColor}
        name="rect"
        id="0"
      ></rect>
      <text
        x="0"
        y="0"
        dominantBaseline="middle"
        textAnchor="middle"
        className="svgText"
      >
        {props.text}
      </text>
    </React.Fragment>
  );
};

export default Rectangle;
