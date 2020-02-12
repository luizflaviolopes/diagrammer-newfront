import React from "react";

const Circle = props => {
  let overlayVariations = {
    opacity: 1,
    visibility: "hidden"
  };

  if (props.highlightConnection)
    overlayVariations = {
      fill: "steelblue",
      opacity: "0.2",
      visibility: "visible"
    };
  else if (props.highlightDrawDragging)
    overlayVariations = {
      fill: "red",
      opacity: "0.2",
      visibility: "visible"
    };
  else if (props.selected) {
    overlayVariations = {
      fill: "none",
      opacity: "1",
      visibility: "visible",
      stroke: "white",
      strokeWidth: "3",
      strokeDasharray: 6
    };
  }

  let overlayObj = <Overlay {...props} variations={overlayVariations} />;

  return (
    <React.Fragment>
      <circle
        style={{ pointerEvents: props.pointerEvents }}
        id={props.id}
        draw="true"
        cx="0"
        cy="0"
        r={props.radius}
        stroke="black"
        strokeWidth="2"
        fill={props.fillColor || "white"}
      />
      {overlayObj}
    </React.Fragment>
  );
};

const Overlay = props => {
  return (
    <circle
      cx="0"
      cy="0"
      r={props.radius}
      style={{ pointerEvents: "none" }}
      {...props.variations}
    />
  );
};

export default Circle;
