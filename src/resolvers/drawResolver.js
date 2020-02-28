export const drawMouseDown = (state, actionPayload) => {
  const drawId = actionPayload.id;
  const selectedDraw = state.draws[drawId];
  if (!selectedDraw.selected) {
    if (!actionPayload.shiftPressed) {
      clearSelecteds(state);
    }

    newSelectedDraw(state, selectedDraw, actionPayload.clientRectPosition);
  }
  // updateBoardOrdering(state);
  state.sessionState.draggingElement = true;

  return state;
};

export const drawDragging = (state, actionPayload) => {
  const drawId = actionPayload.id;
  const selectedDraw = state.draws[drawId];

  if (!selectedDraw.selected) {
    throw { message: "error" };
    // clearSelecteds(state);
    // newSelectedDraw(state, selectedDraw);

    // updateConnectors(selectedDraw, state.connectors);
  } else {
    dragSelecteds(state, actionPayload.position);
  }

  // if (actionPayload.draw) {
  //   state.draws[actionPayload.draw].highlightDrawDragging = true;
  //   state.sessionState.highlightDrawDragging = actionPayload.draw;
  // }

  return state;
};

export const drawdrop = (state, actionPayload) => {
  let selecteds = state.sessionState.elementsSelected;

  //iteration in all droped draws
  for (let i = 0; i < selecteds.length; i++) {
    let draw = state.draws[selecteds[i]];

    //update position
    draw.lastPosition = {
      x: draw.x,
      y: draw.y
    };

    // ver se já está no mesmo pai
    // if (
    //   (draw.parent && draw.parent.id !== actionPayload.id) ||
    //   (draw.parent && !actionPayload.id) ||
    //   (!draw.parent && actionPayload.id)
    // ) {
    reAttachDraw(state, draw, actionPayload);

    state.draws[draw.id] = draw;
    // }
    // else reverseDetachProvisory(state, draw);
  }

  let newSession = { ...state.sessionState };
  newSession.draggingElement = false;

  state.sessionState = newSession;
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
    childrens: [],
    absolutePosition: {
      x: actionPayload.position.x,
      y: actionPayload.position.y
    }
  };

  state.draws[newID] = newDraw;
  state.boardDrawZOrder = [...state.boardDrawZOrder, newID];
  state.boardDrawShowOrder = [...state.boardDrawShowOrder, newID];

  return state;
};

// export const drawSelect = (state, actionPayload) => {
//   clearSelecteds(state.elementsSelected);

//   let selected = getSelectedDraw(state.draws, actionPayload.id);

//   selected.selected = true;
//   selected.lastPosition = {
//     x: selected.x,
//     y: selected.y
//   };
//   state.sessionState.elementsSelected = [selected.id];

//   return state;
// };

export const selectionClear = (state, actionPayload) => {
  clearSelecteds(state);
  return state;
};

// const getSelectedDraw = (list, elementId) => {
//   return list[elementId];
// };

const clearSelecteds = state => {
  let list = state.sessionState.elementsSelected;
  for (let i = 0; i < list.length; i++) {
    state.draws[list[i]].selected = false;
    reverseDetachProvisory(state, state.draws[list[i]]);
  }
  state.sessionState.elementsSelected = [];

  state.boardDrawShowOrder = [...state.boardDrawZOrder];
};

const newSelectedDraw = (state, drawSelected, windowPosition) => {
  drawSelected.selected = true;
  drawSelected.lastPosition = { x: drawSelected.x, y: drawSelected.y };

  state.sessionState.elementsSelected = [
    ...state.sessionState.elementsSelected,
    drawSelected.id
  ];

  detachDrawProvisory(state, drawSelected, windowPosition);
};

// const updateBoardOrdering = state => {
// let nonSelected = getNonSelectedDraws(state);
// state.boardDrawShowOrder = [...nonSelected];
// };

// const zOrderingToOrigin = state => {
//   state.boardDrawShowOrder = [...state.boardDrawZOrder];
// };

// const getNonSelectedDraws = state => {
//   return state.boardDrawShowOrder.filter(e => {
//     return state.sessionState.elementsSelected.indexOf(e) === -1;
//   });
// };

const dragSelecteds = (state, newPos) => {
  let selecteds = state.sessionState.elementsSelected;
  for (let i = 0; i < selecteds.length; i++) {
    const draw = state.draws[selecteds[i]];

    draw.x = draw.lastPosition.x + newPos.x;
    draw.y = draw.lastPosition.y + newPos.y;

    draw.absolutePosition = { x: draw.x, y: draw.y };

    updateConnectors(draw, state.connectors);
  }
  state.connectors = { ...state.connectors };
  return state;
};

const updateConnectors = (draw, connectorsList) => {
  for (let i = 0; i < draw.connectors.length; i++) {
    const connRef = draw.connectors[i];
    const conn = connectorsList[connRef.id];

    let newPositions = { ...conn.endPoints };
    newPositions[draw.id] = {
      x: draw.absolutePosition.x + connRef.centerVariant.x,
      y: draw.absolutePosition.y + connRef.centerVariant.y
    };

    conn.endPoints = newPositions;
  }
};

const detachDrawProvisory = (state, drawToDetach, windowPosition) => {
  if (drawToDetach.parent) {
    let parent = state.draws[drawToDetach.parent.id];
    let drawsUnremoved = removeFromArray(parent.childrens, drawToDetach.id);
    parent.childrens = drawsUnremoved;

    repositionForDetach(drawToDetach, windowPosition);
  } else {
    let drawsUnremoved = removeFromArray(
      state.boardDrawShowOrder,
      drawToDetach.id
    );
    // resetDrawPosition(drawToDetach);

    state.boardDrawShowOrder = drawsUnremoved;
  }
};

const repositionForDetach = (drawDetached, windowPosition) => {
  drawDetached.x = windowPosition.x;
  drawDetached.y = windowPosition.y;

  drawDetached.lastPosition.x = drawDetached.x;
  drawDetached.lastPosition.y = drawDetached.y;
};

const reverseDetachProvisory = (state, drawToReverse) => {
  if (drawToReverse.parent) {
    let parent = state.draws[drawToReverse.parent.id];
    let newChildrens = [...parent.childrens, drawToReverse.id];
    parent.childrens = newChildrens;

    repositionForAttach(drawToReverse);
  }
};

const repositionForAttach = drawAttached => {
  drawAttached.x = drawAttached.x - drawAttached.parent.x;
  drawAttached.y = drawAttached.y - drawAttached.parent.y;
};

const reAttachDraw = (state, drawToReAttach, drawTargetObj) => {
  console.log("reattaching");
  if (drawToReAttach.parent) {
    drawToReAttach.parent = undefined;
  } else
    state.boardDrawZOrder = removeFromArray(
      state.boardDrawZOrder,
      drawToReAttach.id
    );

  if (drawTargetObj.id) {
    drawToReAttach.parent = drawTargetObj;
  } else {
    state.boardDrawZOrder.push(drawToReAttach.id);
  }
};

const removeFromArray = (array, valueToRemove) => {
  let index = array.indexOf(valueToRemove);
  let newArray = [...array];
  newArray.splice(index, 1);
  return newArray;
};

const resetDrawPosition = draw => {
  draw.x = 0;
  draw.y = 0;
};

const attachDraw = (state, drawIdToAttach, target) => {
  if (target) {
    let parent = state.draws[+target];
    let newChildrens = [...parent.childrens, drawIdToAttach];
    parent.childrens = newChildrens;
    console.log("adicionando filho");
  } else {
    state.boardDrawZOrder.push(drawIdToAttach);
  }
};
