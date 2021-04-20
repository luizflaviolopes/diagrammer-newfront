import React from "react";

const padding = 5;
const hitboxSize = 10;

const hitboxes = [
  { corner: "nw", x: 0, y: 0 },
  { corner: "ne", x: 1, y: 0 },
  { corner: "se", x: 1, y: 1 },
  { corner: "sw", x: 0, y: 1 },
];

const ResizeHitbox = (props) => {
  return (
    <rect
      cursor={props.corner + "-resize"}
      type="resizeAnchor"
      corners={props.corner}
      x={props.x - hitboxSize}
      y={props.y - hitboxSize}
      height={hitboxSize}
      width={hitboxSize}
      drawid={props.drawid}
      fill="steelBlue"
    ></rect>
  );
};

const DrawFrame = (props) => {
  const x = -padding;
  const y = -padding;
  const height = props.height + padding * 2;
  const width = props.width + padding * 2;

  return (
    <React.Fragment>
      <rect
        x={x}
        y={y}
        height={height}
        width={width}
        stroke="steelBlue"
        fill="none"
      ></rect>
      {hitboxes.map((box, i) => (
        <ResizeHitbox
          key={i}
          x={width * box.x}
          y={height * box.y}
          corner={box.corner}
          drawid={props.drawid}
        ></ResizeHitbox>
      ))}
    </React.Fragment>
  );
};

export default DrawFrame;
