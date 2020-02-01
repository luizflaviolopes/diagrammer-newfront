export const connectorDrawing = (state, actionPayload) => {
  state.connectors[state.counters.connectors].b = { ...actionPayload };

  return state;
};

export const connectorDrawingStart = (state, actionPayload) => {
  state.transients.connectorDrawing = true;
  state.transients.elementDragStartId = actionPayload.id;

  const conId = state.counters.connectors;
  const drawRef = state.draws[state.transients.elementDragStartId];

  drawRef.connectors = [
    ...drawRef.connectors,
    { id: conId, centerVariant: actionPayload.variant }
  ];

  let position = {
    x: actionPayload.variant.x + drawRef.x,
    y: actionPayload.variant.y + drawRef.y
  };

  state.connectors[conId] = {
    [actionPayload.id]: position,
    b: position
  };

  return state;
};

export const connectorDrawingEnd = (state, actionPayload) => {
  if (actionPayload) {
    const draw = state.draws[actionPayload.id];
    const connCounter = state.counters.connectors;

    let actualConector = { ...state.connectors[connCounter] };
    draw.connectors = [
      ...draw.connectors,
      { id: connCounter, centerVariant: actionPayload.variants }
    ];

    actualConector[actionPayload.id] = actualConector.b;
    delete actualConector.b;

    state.connectors[connCounter] = actualConector;
  }

  state.transients.connectorDrawing = false;
  state.transients.elementDragStartId = null;

  state.counters.connectors = state.counters.connectors + 1;
  console.log(actionPayload);

  return state;
};
