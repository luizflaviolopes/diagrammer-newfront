export const getPositionBoardRelative = (
  boardView,
  absoluteposition
  // onlyZoom = false
) => {
  return {
    x: absoluteposition.x / boardView.zoom - boardView.x,
    y: absoluteposition.y / boardView.zoom - boardView.y,
  };
};

export const getDisplacementBoardRelative = (boardView, absoluteposition) => {
  return {
    x: absoluteposition.x / boardView.zoom,
    y: absoluteposition.y / boardView.zoom,
  };
};

export const getPointBoardRelative = (boardView, absoluteposition) => {
  return {
    x: (absoluteposition.x - boardView.x) / boardView.zoom,
    y: (absoluteposition.y - boardView.y) / boardView.zoom,
  };
};
