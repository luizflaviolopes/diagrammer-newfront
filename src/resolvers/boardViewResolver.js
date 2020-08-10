export const changeZoom = (state, actionPayload) => {
  const mousePosition = actionPayload.mousePosition;

  const zoomValue = actionPayload.value / 1000;

  const correctMouseX = -state.x / state.zoom + mousePosition.x / state.zoom;
  const correctMouseY = -state.y / state.zoom + mousePosition.y / state.zoom;

  state.x -= correctMouseX * zoomValue;
  state.y -= correctMouseY * zoomValue;

  state.zoom += zoomValue;

  return state;
};
