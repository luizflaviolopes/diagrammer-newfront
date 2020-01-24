import React from "react";

const mouseFunctions = {
  onMouseDown: e => {
    setOrigin({ x: e.clientX, y: e.clientY });
    setDragging(true);
  },
  onMouseMove: e => {
    if (dragging) {
      setPosition({
        x: e.clientX - origin.x,
        y: e.clientY - origin.y
      });
    }
  },
  onMouseUp: () => {
    setDragging(false);
  }
};
