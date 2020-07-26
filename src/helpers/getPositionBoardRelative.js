export const getPositionBoardRelative = (
  boardView,
  absoluteposition,
  onlyZoom = false
) => {
  if (onlyZoom)
    return {
      x: absoluteposition.x / boardView.zoom,
      y: absoluteposition.y / boardView.zoom,
    };
  else
    return {
      x: absoluteposition.x / boardView.zoom - boardView.x,
      y: absoluteposition.y / boardView.zoom - boardView.y,
    };
};
