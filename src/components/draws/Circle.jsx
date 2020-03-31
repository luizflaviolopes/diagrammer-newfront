import React from "react";

const Circle = props => {
  const radius =
    props.width > props.heigth ? props.width / 2 : props.heigth / 2;

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
      opacity: "0.7",
      visibility: "visible",
      stroke: "white",
      strokeWidth: "3",
      strokeDasharray: 6
    };
  }

  let overlayObj = (
    <Overlay {...props} variations={overlayVariations} radius={radius} />
  );

  return (
    <React.Fragment>
      <circle
        style={{ pointerEvents: props.pointerEvents }}
        id={props.id}
        draw="true"
        cx={radius}
        cy={radius}
        r={radius}
        stroke="black"
        strokeWidth="2"
        fill={props.fillColor || "white"}
        opacity={props.selected ? "0.7" : "1"}
      />
      {overlayObj}
    </React.Fragment>
  );
};

const Overlay = props => {
  return (
    <circle
      cx={props.radius}
      cy={props.radius}
      r={props.radius}
      style={{ pointerEvents: "none" }}
      {...props.variations}
    />
  );
};

export default Circle;
