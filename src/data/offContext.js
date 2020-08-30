var contextData = {};

export const setStartDrag = (positionRelative) => {
  contextData.dragging = true;
  contextData.startPosition = positionRelative;
};

export const isDragging = () => {
  return contextData.dragging;
};
