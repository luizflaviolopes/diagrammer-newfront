export const drawMouseDown = (state, actionPayload) => {
  const drawId = actionPayload.id;
  const selectedDraw = state.draws[drawId];

  if (!selectedDraw.selected) {
    selectedDraw.selected = true;
    selectedDraw.lastPosition = { x: selectedDraw.x, y: selectedDraw.y };
    if (!actionPayload.shiftPressed) {
      clearSelecteds(state);
    }

    newSelectedDraw(state, selectedDraw);
  }
  newSelectionZOrdering(state);
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

  for (let i = 0; i < selecteds.length; i++) {
    let draw = selecteds[i];
    // ver se já está no mesmo pai
    console.log(draw.parent, actionPayload.id);
    if (draw.parent !== actionPayload.id) {
      console.log("entrous");
      //remover do pai atual
      detachDraw(state, draw);

      //adicionar no novo pai
      attachDraw(state, draw.id, actionPayload.id);
    }
  }

  state.sessionState.draggingElement = false;
  zOrderingToOrigin(state);
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
    connectors: [],
    parent: undefined,
    childrens: []
  };

  state.draws[newID] = newDraw;
  state.boardDrawZOrder.push(newID);
  state.boardDrawShowOrder.push(newID);

  return state;
};

export const drawSelect = (state, actionPayload) => {
  clearSelecteds(state.elementsSelected);

  let selected = getSelectedDraw(state.draws, actionPayload.id);

  selected.selected = true;
  selected.lastPosition = {
    x: selected.x,
    y: selected.y
  };
  state.sessionState.elementsSelected = [selected];

  return state;
};

export const selectionClear = (state, actionPayload) => {
  clearSelecteds(state);
  return state;
};

const getSelectedDraw = (list, elementId) => {
  return list[elementId];
};

const clearSelecteds = state => {
  let list = state.sessionState.elementsSelected;
  for (let i = 0; i < list.length; i++) {
    list[i].selected = false;
  }
  state.sessionState.elementsSelected = [];
  state.boardDrawSelected = [];
};

const newSelectedDraw = (state, element) => {
  state.sessionState.elementsSelected = [
    ...state.sessionState.elementsSelected,
    element
  ];
  state.boardDrawSelected = [...state.boardDrawSelected, element.id];
};

const newSelectionZOrdering = state => {
  let nonSelected = state.boardDrawShowOrder.filter(e => {
    return state.boardDrawSelected.indexOf(e) === -1;
  });

  state.boardDrawShowOrder = [...nonSelected, ...state.boardDrawSelected];
};

const zOrderingToOrigin = state => {
  state.boardDrawShowOrder = [...state.boardDrawZOrder];
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

const detachDraw = (state, drawToDetach) => {
  if (drawToDetach.parent) {
    let parent = state.draws[drawToDetach.parent];
    let drawsUnremoved = parent.childrens.filter(e => {
      return e !== drawToDetach.id;
    });
    parent.childrens = drawsUnremoved;
  } else {
    let drawsUnremoved = state.boardDrawZOrder.filter(e => {
      return e !== drawToDetach.id;
    });

    state.boardDrawZOrder = drawsUnremoved;
  }
};

const attachDraw = (state, drawIdToAttach, target) => {
  if (target) {
    state.draws[+target].childrens.push(drawIdToAttach);
  } else state.boardDrawZOrder.push(drawIdToAttach);
};
