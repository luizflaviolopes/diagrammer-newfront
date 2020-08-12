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
