export const connectorDrawing = (state, actionPayload) => {
  console.log("connectorDragging", state.connectors, state.counters.connectors);
  state.connectors[state.counters.connectors].endPoints.b = {
    ...actionPayload
  };

  state.connectors = { ...state.connectors };
  return state;
};

export const connectorDrawingStart = (state, actionPayload) => {
  state.sessionState.connectorDrawing = true;
  state.sessionState.elementDragStart = {
    id: actionPayload.id,
    variant: actionPayload.variant
  };

  const conId = state.counters.connectors;
  const drawRef = state.draws[actionPayload.id];

  // drawRef.connectors = [
  //   ...drawRef.connectors,
  //   { id: conId, centerVariant: actionPayload.variant }
  // ];

  let position = {
    x: actionPayload.variant.x + drawRef.x,
    y: actionPayload.variant.y + drawRef.y
  };

  state.connectors[conId] = {
    endPoints: {
      [actionPayload.id]: position,
      b: position
    }
  };

  return state;
};

export const connectorDrawingEnd = (state, actionPayload) => {
  if (actionPayload) {
    const drawB = state.draws[actionPayload.id];
    const connCounter = state.counters.connectors;

    const drawA = state.draws[state.sessionState.elementDragStart.id];
    drawA.connectors = [
      ...drawA.connectors,
      {
        id: connCounter,
        centerVariant: state.sessionState.elementDragStart.variant
      }
    ];

    drawB.connectors = [
      ...drawB.connectors,
      { id: connCounter, centerVariant: actionPayload.variants }
    ];

    let actualConector = { ...state.connectors[connCounter].endPoints };
    actualConector[actionPayload.id] = actualConector.b;
    delete actualConector.b;

    state.connectors[connCounter].endPoints = actualConector;

    state.counters.connectors = state.counters.connectors + 1;
  } else {
    let connectors = { ...state.connectors };
    delete connectors[state.counters.connectors];
    state.connectors = connectors;
  }

  state.sessionState.connectorDrawing = false;
  state.sessionState.elementDragStart = null;

  return state;
};
