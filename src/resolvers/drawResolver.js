import elementsConnectorPointsCalculator from "../helpers/elementsConnectorPointsCalculator";
import { clearConnectorSelection } from "./connectorsResolver";

export const selectDraw = (state, actionPayload) => {
  const drawId = actionPayload.id;
  const selectedDraw = state.draws[drawId];

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

  if (actionPayload.id) {
    const parent = state.draws[actionPayload.id];
    const padding = 10;
    const firstElement = state.draws[selecteds[0]];
    let minX = firstElement.x;
    let minY = firstElement.y;
    let maxRight = firstElement.x + firstElement.width;
    let maxBottom = firstElement.y + firstElement.heigth;

    for (let z = 1; z < selecteds.length; z++) {
      let elementSelected = state.draws[selecteds[z]];
      if (elementSelected.x < minX) minX = elementSelected.x;
      if (elementSelected.y < minY) minY = elementSelected.y;
      if (elementSelected.x + elementSelected.width > maxRight)
        maxRight = elementSelected.x + elementSelected.width;
      if (elementSelected.y + elementSelected.heigth > maxBottom)
        maxBottom = elementSelected.y + elementSelected.heigth;
    }

    const newAbsolutePosition = updateParentSize(
      state,
      parent,
      {
        x: actionPayload.x,
        y: actionPayload.y,
      },
      { minX, minY, maxRight, maxBottom, padding }
    );

    resizeGrandParents(state, parent, padding);

    //é possível aumentar a performance, separando o calculo para x e y.
    if (newAbsolutePosition.varX < 0 || newAbsolutePosition.varY < 0) {
      for (let c = 0; c < parent.childrens.length; c++) {
        updateChildrensPositionOnParentResize(
          state.draws[parent.childrens[c]],
          {
            x: newAbsolutePosition.varX,
            y: newAbsolutePosition.varY,
          }
        );
      }
    }

    for (let a = 0; a < selecteds.length; a++) {
      let droppedDraw = state.draws[selecteds[a]];

      // board to parent
      if (!droppedDraw.parent) {
        addParentInChildren(droppedDraw, actionPayload.id);
        removeDrawFromBoard(state, droppedDraw.id);
        updateDroppedChildrenPosition(
          droppedDraw,
          newAbsolutePosition,
          padding
        );
      }
    }
  }

  //iteration in all droped draws
  // for (let i = 0; i < selecteds.length; i++) {
  //   let draw = state.draws[selecteds[i]];

  //   // updateDrawLastPosition(state, draw);

  //   if (actionPayload.id) {
  //     // parent1 to parent2
  //     else if (actionPayload.id !== draw.parent) {
  //       removeDrawFromParent(state, draw);
  //       addDrawToParent(state, draw, actionPayload.id);
  //     }
  //   } else {
  //     //parent to board
  //     if (draw.parent) {
  //       removeDrawFromParent(state, draw);
  //       addDrawToBoard(state, draw.id);
  //     }
  //   }
  // }

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

const clearSelecteds = (state) => {
  let list = state.sessionState.elementsSelected;
  for (let i = 0; i < list.length; i++) {
    let actualDraw = state.draws[list[i]];
    actualDraw.selected = false;
    if(actualDraw.parent)
      addChildrenInParent(state, actualDraw);
  }
  state.sessionState.elementsSelected = [];

  state.boardDrawShowOrder = [...state.boardDrawZOrder];
};

const newSelectedDraw = (state, drawSelected) => {
  drawSelected.selected = true;
  drawSelected.lastPosition = { x: drawSelected.x, y: drawSelected.y };

  state.sessionState.elementsSelected = [
    ...state.sessionState.elementsSelected,
    drawSelected.id,
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

  //updateChildrensPosition(state, draw, posVariation);
  updateConnectors(draw, state.connectors);
};

const updateDrawLastPosition = (state, draw) => {
  draw.lastPosition = {
    x: draw.x,
    y: draw.y,
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
    const point = connectorPoints.find((el) => {
      return el.pointRef == connRef.centerVariant.pointRef;
    });

    draw.connectors[i].centerVariant = point;

    let newPositions = [...conn.endPoints];

    newPositions[connRef.endPoint].x = draw.x + point.x;
    newPositions[connRef.endPoint].y = draw.y + point.y;

    conn.endPoints = newPositions;
  }
};

const updateParentSize = (state, parent, absolutePosition, measures) => {
  const padding = measures.padding;
  console.log("atualizando tamanho");
  let variationX = 0;
  let variationY = 0;
  let variationH = 0;
  let variationW = 0;

  if (measures.minX < absolutePosition.x + padding) {
    variationX = measures.minX - (absolutePosition.x + padding);

    parent.x = parent.x + variationX;
    parent.width = parent.width - variationX;
  }
  if (measures.minY < absolutePosition.y + padding) {
    variationY = measures.minY - (absolutePosition.y + padding);

    parent.y = parent.y + variationY;
    parent.heigth = parent.heigth - variationY;
  }
  if (
    measures.maxRight >
    absolutePosition.x + variationX + parent.width - padding
  ) {
    variationW =
      measures.maxRight +
      padding -
      (absolutePosition.x + variationX + parent.width);
    parent.width = parent.width + variationW;
  }
  if (
    measures.maxBottom >
    absolutePosition.y + variationY + parent.heigth - padding
  ) {
    variationH =
      measures.maxBottom +
      padding -
      (absolutePosition.y + variationY + parent.heigth);
    parent.heigth = parent.heigth + variationH;
  }

  updateConnectorsFromResize(parent, state.connectors);

  return {
    x: absolutePosition.x + variationX,
    y: absolutePosition.y + variationY,
    varX: variationX,
    varY: variationY,
    varW: variationW,
    varH: variationH,
  };
};

const addChildrenInParent = (state, children) => {
  let parent = state.draws[children.parent];

  let newChildrens = [...parent.childrens, children.id];
  parent.childrens = newChildrens;
};

const addParentInChildren = (children, parentId) => {
  children.parent = parentId;
}

const updateDroppedChildrenPosition = (children, absolutePosition, padding) => {
  const calcX = children.x - absolutePosition.x;
  const calcY = children.y - absolutePosition.y;

  children.x = calcX;
  children.y = calcY;
};

const updateChildrensPositionOnParentResize = (children, variation) => {
  children.x = children.x - variation.x;
  children.y = children.y - variation.y;
};

const resizeGrandParents = (state, parent, padding) => {
  if (!parent.parent) return;

  const grandParent = state.draws[parent.parent];
  let variationX = 0;
  let variationY = 0;
  let isUpdated = false;

  if (parent.x < padding) {
    variationX = parent.x - padding;

    grandParent.x = grandParent.x + variationX;
    grandParent.width = grandParent.width - variationX;
    isUpdated = true;
  }
  if (parent.y < padding) {
    variationY = parent.y - padding;

    grandParent.y = grandParent.y + variationY;
    grandParent.heigth = grandParent.heigth - variationY;
    isUpdated = true;
  }
  if (parent.x + parent.width - variationX > grandParent.width - padding) {
    grandParent.width = parent.x + parent.width + padding - variationX;
    isUpdated = true;
  }
  if (parent.y + parent.heigth - variationY > grandParent.heigth - padding) {
    grandParent.heigth = parent.y + parent.heigth + padding - variationY;
    isUpdated = true;
  }

  if (variationX < 0 || variationY < 0) {
    for (let c = 0; c < grandParent.childrens.length; c++) {
      updateChildrensPositionOnParentResize(
        state.draws[grandParent.childrens[c]],
        {
          x: variationX,
          y: variationY,
        }
      );
    }
  }

  if (isUpdated) resizeGrandParents(state, grandParent, padding);
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
