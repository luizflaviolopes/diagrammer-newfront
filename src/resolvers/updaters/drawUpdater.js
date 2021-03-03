import connectorsUpdater from "./connectorsUpdater";

const updateDrawPosition = (state, draw, mouseMovementZoomRelative) => {
  const newDraw = { ...draw };

  newDraw.absolutePosition = {
    x: newDraw.absolutePosition.x + mouseMovementZoomRelative.x,
    y: newDraw.absolutePosition.y + mouseMovementZoomRelative.y,
  };

  state.draws[draw.id] = newDraw;

  connectorsUpdater.updateConnectors(draw, state, mouseMovementZoomRelative);
};

const updateDrawAbsolutePosition = (
  state,
  draw,
  newAbsolutePositionX,
  newAbsolutePositionY
) => {
  const newDraw = { ...draw };

  newDraw.absolutePosition = {
    x: newAbsolutePositionX,
    y: newAbsolutePositionY,
  };

  state.draws[draw.id] = newDraw;
};

export default { updateDrawPosition, updateDrawAbsolutePosition };
