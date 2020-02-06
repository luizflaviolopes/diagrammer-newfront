export const drawMouseDown = (state, actionPayload) => {
  const drawId = actionPayload.id;
  const selectedDraw = state.draws[drawId];

  if (!selectedDraw.selected) {
    selectedDraw.selected = true;
    selectedDraw.lastPosition = { x: selectedDraw.x, y: selectedDraw.y };
    if (!actionPayload.shiftPressed) {
      clearSelecteds(state.sessionState);
      state.sessionState.elementsSelected = [selectedDraw];
    } else {
      state.sessionState.elementsSelected = [
        ...state.sessionState.elementsSelected,
        selectedDraw
      ];
    }
  }

  state.sessionState.draggingElement = true;

  return state;
};

export const drawDragging = (state, actionPayload) => {
  const drawId = actionPayload.id;
  const selectedDraw = state.draws[drawId];

  if (!selectedDraw.selected) {
    if (!selectedDraw.lastPosition)
      selectedDraw.lastPosition = { x: selectedDraw.x, y: selectedDraw.y };

    selectedDraw.x = selectedDraw.lastPosition.x + actionPayload.position.x;
    selectedDraw.y = selectedDraw.lastPosition.y + actionPayload.position.y;

    updateConnectors(selectedDraw, state.connectors);
  } else {
    dragSelecteds(state, actionPayload.position);
  }

  if (actionPayload.draw) {
    state.draws[actionPayload.draw].highlightDrawDragging = true;
    state.sessionState.highlightDrawDragging = actionPayload.draw;
  }

  return state;
};

export const clearHighLightDrawDragging = (state, actionPayload) => {
  state.draws[actionPayload.id].highlightDrawDragging = false;
  state.sessionState.highlightDrawDragging = undefined;

  return state;
};

export const drawdrop = (state, actionPayload) => {
  let selecteds = state.sessionState.elementsSelected;

  //iteration to update "last position" of all itens
  for (let i = 0; i < selecteds.length; i++) {
    let el = selecteds[i];
    el.lastPosition = {
      x: el.x,
      y: el.y
    };
  }

  state.sessionState.draggingElement = false;

  return state;
};

export const drawAdd = (state, actionPayload) => {
  const newID = state.counters.draws++;

  let newDraw = {
    type: actionPayload.type,
    text: "",
    x: actionPayload.position.x,
    y: actionPayload.position.y,
    heigth: 100,
    width: 100,
    id: newID,
    connectors: []
  };

  state.draws[newID] = newDraw;

  return state;
};

export const drawSelect = (state, actionPayload) => {
  clearSelecteds(state.sessionState.elementsSelected);

  let selected = getSelectedDraw(state.draws, actionPayload.id);

  selected.selected = true;
  selected.lastPosition = {
    x: selected.x,
    y: selected.y
  };
  state.sessionState.elementsSelected = [selected];

  return state;
};

export const drawAddSelection = (state, actionPayload) => {
  let selected = getSelectedDraw(state.draws, actionPayload.id);

  state.sessionState.elementsSelected = addToSelection(
    state.sessionState.elementsSelected,
    selected
  );

  return state;
};

export const selectionClear = (state, actionPayload) => {
  clearSelecteds(state.sessionState);
  return state;
};

const getSelectedDraw = (list, elementId) => {
  return list[elementId];
};

const clearSelecteds = sessionState => {
  let list = sessionState.elementsSelected;
  for (let i = 0; i < list.length; i++) {
    list[i].selected = false;
  }
  sessionState.elementsSelected = [];
};

const addToSelection = (selectionList, elementToAdd) => {
  elementToAdd.selected = true;
  elementToAdd.lastPosition = {
    x: elementToAdd.x,
    y: elementToAdd.y
  };
  return [...selectionList, elementToAdd];
};

const dragSelecteds = (state, newPos) => {
  for (let i = 0; i < state.sessionState.elementsSelected.length; i++) {
    const draw = state.sessionState.elementsSelected[i];

    draw.x = draw.lastPosition.x + newPos.x;
    draw.y = draw.lastPosition.y + newPos.y;

    updateConnectors(draw, state.connectors);
  }
  return state;
};

const updateConnectors = (draw, connectorsList, newPos) => {
  for (let i = 0; i < draw.connectors.length; i++) {
    const connRef = draw.connectors[i];
    const conn = connectorsList[connRef.id];
    conn[draw.id] = {
      x: draw.x + connRef.centerVariant.x,
      y: draw.y + connRef.centerVariant.y
    };
  }
};
