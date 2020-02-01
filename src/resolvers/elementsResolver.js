export const elementDragging = (state, actionPayload) => {
  const elementId = actionPayload.id;
  const element = state.draws[elementId];

  element.x = actionPayload.position.x;
  element.y = actionPayload.position.y;

  for (let i = 0; i < element.connectors.length; i++) {
    const connRef = element.connectors[i];
    const conn = state.connectors[connRef.id];
    conn[elementId] = {
      x: actionPayload.position.x + connRef.centerVariant.x,
      y: actionPayload.position.y + connRef.centerVariant.y
    };
  }

  return state;
};

export const elementAdd = (state, actionPayload) => {
  let newElement = {
    type: actionPayload.type,
    text: "",
    x: actionPayload.position.x,
    y: actionPayload.position.y,
    heigth: 100,
    width: 100,
    connectors: []
  };

  state.draws[state.counters.draws++] = newElement;

  return state;
};
