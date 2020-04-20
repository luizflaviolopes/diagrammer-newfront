export const getPositionBoardRelative = (state, absoluteposition) => {
  return {
    x: absoluteposition.x - state.boardView.x,
    y: absoluteposition.y - state.boardView.y,
  };
};
