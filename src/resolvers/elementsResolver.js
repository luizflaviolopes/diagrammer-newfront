export const elementDragging = (state, actionPayload) => {
  const elementId = actionPayload.id;
  const element = state.draws[elementId];
  element.x = actionPayload.position.x;

  element.y = actionPayload.position.y;

  for (let i = 0; i < element.connectors; i++) {
    const connId = element.connectors[i];
    state.connectors[connId][elementId] = actionPayload.center;
  }

  return state;
};

export const elementAdd = (state, actionPayload) => {
  let newElement = {
    type: actionPayload.type,
    text: "teste++",
    x: actionPayload.position.x,
    y: actionPayload.position.y,
    heigth: 100,
    width: 100,
    connectors: []
  };

  state.draws[state.counters.draws++] = newElement;

  return state;
};
