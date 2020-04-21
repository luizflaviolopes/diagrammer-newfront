import React from "react";

const Rectangle = (props) => {
  let overlayVariations = {
    opacity: 1,
    visibility: "hidden",
  };

  if (props.highlightConnection) {
    overlayVariations = {
      fill: "steelblue",
      opacity: "0.2",
      visibility: "visible",
    };
  } else if (props.highlightDrawDragging)
    overlayVariations = {
      fill: "red",
      opacity: "0.2",
      visibility: "visible",
    };
  else if (props.selected) {
    overlayVariations = {
      fill: "none",
      opacity: "1",
      visibility: "visible",
      stroke: "white",
      strokeWidth: "3",
      strokeDasharray: 6,
    };
  }

  let overlayObj = <Overlay {...props} variations={overlayVariations} />;

  return (
    <React.Fragment>
      <rect
        style={{ pointerEvents: props.pointerEvents }}
        id={props.id}
        x="0"
        y="0"
        height={props.heigth}
        width={props.width}
        stroke="black"
        strokeWidth="2"
        fill={props.fillColor || "white"}
        draw="true"
        opacity={props.selected ? "0.7" : "1"}
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
      {overlayObj}
    </React.Fragment>
  );
};

const Overlay = (props) => {
  return (
    <rect
      x="0"
      y="0"
      height={props.heigth}
      width={props.width}
      {...props.variations}
      style={{ pointerEvents: "none" }}
    ></rect>
  );
};

export const Demo = (props) => {
  return <rect x="0" y="0" height={100} width={100}></rect>;
};

export default Rectangle;
