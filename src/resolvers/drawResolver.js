import elementsConnectorPointsCalculator from "../helpers/elementsConnectorPointsCalculator";
import { clearConnectorSelection } from "./connectorsResolver";

export const drawMouseDown = (state, actionPayload) => {
  const drawId = actionPayload.id;
  const selectedDraw = state.draws[drawId];

  clearConnectorSelection(state);

  if (!selectedDraw.selected) {
    if (!actionPayload.shiftPressed) {
      clearSelecteds(state);
    }

    newSelectedDraw(state, selectedDraw, actionPayload.clientRectPosition);
  }
  state.sessionState.draggingElement = true;

  return state;
};

export const drawDragging = (state, actionPayload) => {
  let selecteds = state.sessionState.elementsSelected;
  let newPos = actionPayload.position;

  for (let i = 0; i < selecteds.length; i++) {
    const draw = state.draws[selecteds[i]];

    updateDrawPosition(state, draw, newPos);
  }

  return state;
};

export const drawdrop = (state, actionPayload) => {
  let selecteds = state.sessionState.elementsSelected;

  //iteration in all droped draws
  for (let i = 0; i < selecteds.length; i++) {
    let draw = state.draws[selecteds[i]];

    updateDrawLastPosition(state, draw);

    if (actionPayload.id) {
      // board to parent
      if (!draw.parent) {
        addDrawToParent(state, draw, actionPayload.id);
        removeDrawFromBoard(state, draw.id);
      }
      // parent1 to parent2
      else if (actionPayload.id !== draw.parent) {
        removeDrawFromParent(state, draw);
        addDrawToParent(state, draw, actionPayload.id);
      }

      updateParentSize(state, draw);
    } else {
      //parent to board
      if (draw.parent) {
        removeDrawFromParent(state, draw);
        addDrawToBoard(state, draw.id);
      }
    }
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

export const selectionClear = (state, actionPayload) => {
  clearSelecteds(state);
  clearConnectorSelection(state);
  return state;
};

const clearSelecteds = state => {
  let list = state.sessionState.elementsSelected;
  for (let i = 0; i < list.length; i++) {
    state.draws[list[i]].selected = false;
  }
  state.sessionState.elementsSelected = [];

  state.boardDrawShowOrder = [...state.boardDrawZOrder];
};

const newSelectedDraw = (state, drawSelected) => {
  drawSelected.selected = true;
  drawSelected.lastPosition = { x: drawSelected.x, y: drawSelected.y };

  state.sessionState.elementsSelected = [
    ...state.sessionState.elementsSelected,
    drawSelected.id
  ];

  // ##remover do showorder
  let drawsUnremoved = removeFromArray(
    state.boardDrawShowOrder,
    +drawSelected.id
  );

  state.boardDrawShowOrder = drawsUnremoved;
};

const updateDrawPosition = (state, draw, posVariation) => {
  const newDraw = { ...draw };

  newDraw.x = draw.lastPosition.x + posVariation.x;
  newDraw.y = draw.lastPosition.y + posVariation.y;

  state.draws[draw.id] = newDraw;

  console.log("updated position", draw.id);

  updateChildrensPosition(state, draw, posVariation);
  updateConnectors(draw, state.connectors);
};

const updateChildrensPosition = (state, draw, posVariation) => {
  for (let i = 0; i < draw.childrens.length; i++) {
    const children = state.draws[draw.childrens[i]];

    updateDrawPosition(state, children, posVariation);
  }
};

const updateDrawLastPosition = (state, draw) => {
  draw.lastPosition = {
    x: draw.x,
    y: draw.y
  };
  updateChildrensLastPosition(state, draw);
};

const updateChildrensLastPosition = (state, draw) => {
  for (let i = 0; i < draw.childrens.length; i++) {
    const children = state.draws[draw.childrens[i]];

    updateDrawLastPosition(state, children);
  }
};

const updateConnectors = (draw, connectorsList) => {
  for (let i = 0; i < draw.connectors.length; i++) {
    const connRef = draw.connectors[i];
    const conn = connectorsList[connRef.id];

    let newPositions = [...conn.endPoints];
    newPositions[connRef.endPoint].x = draw.x + connRef.centerVariant.x;
    newPositions[connRef.endPoint].y = draw.y + connRef.centerVariant.y;

    conn.endPoints = newPositions;
  }
};

const updateConnectorsFromResize = (draw, connectorsList) => {
  for (let i = 0; i < draw.connectors.length; i++) {
    const connRef = draw.connectors[i];
    const conn = connectorsList[connRef.id];

    const connectorPoints = elementsConnectorPointsCalculator(
      draw.type,
      draw.width,
      draw.heigth
    );
    const point = connectorPoints.find(el => {
      return el.pointRef == connRef.centerVariant.pointRef;
    });

    draw.connectors[i].centerVariant = point;

    let newPositions = [...conn.endPoints];

    newPositions[connRef.endPoint].x = draw.x + point.x;
    newPositions[connRef.endPoint].y = draw.y + point.y;

    conn.endPoints = newPositions;
  }
};

const updateParentSize = (state, droppedDraw) => {
  const padding = 10;
  console.log("atualizando tamanho", droppedDraw);
  const parent = state.draws[droppedDraw.parent];
  let variationX = 0;
  let variationY = 0;
  let variationH = 0;
  let variationW = 0;

  if (droppedDraw.x < parent.x) {
    variationX = droppedDraw.x - (parent.x + padding);
    parent.x = parent.x + variationX;
  }
  if (droppedDraw.y < parent.y) {
    variationY = droppedDraw.y - (parent.y + padding);
    parent.y = parent.y + variationY;
  }
  if (droppedDraw.x + droppedDraw.width > parent.x + parent.width) {
    variationW =
      droppedDraw.x + droppedDraw.width + padding - (parent.x + parent.width);
  }
  if (droppedDraw.y + droppedDraw.heigth > parent.y + parent.heigth) {
    variationH =
      droppedDraw.y + droppedDraw.heigth + padding - (parent.y + parent.heigth);
  }

  parent.width = parent.width - variationX + variationW;
  parent.heigth = parent.heigth - variationY + variationH;

  updateConnectorsFromResize(parent, state.connectors);
};

const addDrawToParent = (state, children, parentId) => {
  children.parent = parentId;
  let parent = state.draws[parentId];
  let newChildrens = [...parent.childrens, children.id];
  parent.childrens = newChildrens;
};

const removeDrawFromParent = (state, drawToRemove) => {
  let parent = state.draws[drawToRemove.parent];
  let newChildrens = removeFromArray(parent.childrens, drawToRemove.id);
  parent.childrens = newChildrens;

  drawToRemove.parent = undefined;
};

const removeDrawFromBoard = (state, drawId) => {
  state.boardDrawZOrder = removeFromArray(state.boardDrawZOrder, +drawId);
};

const addDrawToBoard = (state, drawId) => {
  state.boardDrawZOrder.push(drawId);
};

const removeFromArray = (array, valueToRemove) => {
  let index = array.indexOf(valueToRemove);
  if (index > -1) {
    let newArray = [...array];
    newArray.splice(index, 1);
    return newArray;
  } else return array;
};
