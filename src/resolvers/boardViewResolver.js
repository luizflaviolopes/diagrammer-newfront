export const changeZoom = (state, actionPayload) => {
  const zoomValue = actionPayload.value / 1000;

  state.zoom += zoomValue;

  return state;
};
