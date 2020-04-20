export const getPositionBoardRelative = (
  state,
  absoluteposition,
  onlyZoom = false
) => {
  if (onlyZoom)
    return {
      x: absoluteposition.x / state.boardView.zoom,
      y: absoluteposition.y / state.boardView.zoom,
    };
  else
    return {
      x: absoluteposition.x / state.boardView.zoom - state.boardView.x,
      y: absoluteposition.y / state.boardView.zoom - state.boardView.y,
    };
};
