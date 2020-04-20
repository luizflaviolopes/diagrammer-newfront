import elementsConnectorPointsCalculator from "../helpers/elementsConnectorPointsCalculator";
import { clearConnectorSelection } from "./connectorsResolver";
import { drop } from "../actions/drawing";
import { removeFromArray } from "../helpers/arrayManipulation";
import { getPositionBoardRelative } from "../helpers/getPositionBoardRelative";

export const selectDraw = (state, actionPayload) => {
  const drawId = actionPayload.id;
  const selectedDraw = state.draws[drawId];

  if (!actionPayload.shiftPressed) {
    clearDrawSelected(state);
  }

  newSelectedDraw(state, selectedDraw, actionPayload.clientRectPosition);
  state.sessionState.draggingElement = true;

  return state;
};

export const drawDragging = (state, actionPayload) => {
  let selecteds = state.sessionState.drawsSelected;
  let newPos = actionPayload.position;

  for (let i = 0; i < selecteds.length; i++) {
    const draw = state.draws[selecteds[i]];

    updateDrawPosition(state, draw, newPos);
  }

  return state;
};

export const drawdrop = (state, actionPayload) => {
  let selecteds = state.sessionState.drawsSelected;

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

    const positionBoardRelative = getPositionBoardRelative(
      state,
      actionPayload
    );

    const newAbsolutePosition = updateParentSize(
      state,
      parent,
      positionBoardRelative,
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
      } else {
        addParentInChildren(droppedDraw, actionPayload.id);
      }
    }
  } else {
    //Remove parent from children when dropping draw on board
    for (let a = 0; a < selecteds.length; a++) {
      let selectedDraw = state.draws[selecteds[a]];
      if (selectedDraw.parent) {
        selectedDraw.parent = undefined;
        state.boardDrawZOrder = [...state.boardDrawZOrder, selectedDraw.id];
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
    x: actionPayload.position.x - state.boardView.x,
    y: actionPayload.position.y - state.boardView.y,
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

export const clearAllSelections = (state, actionPayload) => {
  clearDrawSelected(state);
  clearConnectorSelection(state);
  return state;
};

export const clearDrawSelected = (state) => {
  let list = state.sessionState.drawsSelected;
  for (let i = 0; i < list.length; i++) {
    let actualDraw = state.draws[list[i]];
    actualDraw.selected = false;
    if (actualDraw.parent) addChildrenInParent(state, actualDraw);
  }
  state.sessionState.drawsSelected = [];

  state.boardDrawShowOrder = [...state.boardDrawZOrder];
};

const newSelectedDraw = (state, drawSelected, clientRectPosition) => {
  const positionBoardRelative = getPositionBoardRelative(
    state,
    clientRectPosition
  );

  drawSelected.absolutePosition = {
    x: positionBoardRelative.x,
    y: positionBoardRelative.y,
  };

  if (!drawSelected.selected) {
    drawSelected.selected = true;

    drawSelected.x = positionBoardRelative.x;
    drawSelected.y = positionBoardRelative.y;

    state.sessionState.drawsSelected = [
      ...state.sessionState.drawsSelected,
      drawSelected.id,
    ];

    if (drawSelected.parent) {
      detachChildrenFromParentOnSelect(
        state.draws[drawSelected.parent],
        drawSelected.id
      );
    }

    // ##remover do showorder
    let drawsUnremoved = removeFromArray(
      state.boardDrawShowOrder,
      +drawSelected.id
    );

    state.boardDrawShowOrder = drawsUnremoved;
  }
};

const detachChildrenFromParentOnSelect = (parent, children_id) => {
  parent.childrens = removeFromArray(parent.childrens, children_id);
};

const updateDrawPosition = (state, draw, posVariation) => {
  const newDraw = { ...draw };

  newDraw.x = draw.absolutePosition.x + posVariation.x;
  newDraw.y = draw.absolutePosition.y + posVariation.y;

  let newPositionVariationForConnector = {
    x: newDraw.x - draw.x,
    y: newDraw.y - draw.y,
  };

  state.draws[draw.id] = newDraw;

  console.log("updated position", draw.id);

  //updateChildrensPosition(state, draw, posVariation);
  updateConnectors(draw, state, newPositionVariationForConnector);
};

const updateDrawLastPosition = (state, draw) => {
  draw.absolutePosition = {
    y: draw.x,
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

const updateConnectors = (draw, state, onMouseMovePositionVariant) => {
  const connectorsList = state.connectors;
  for (let i = 0; i < draw.connectors.length; i++) {
    console.log("Atualizando conector.");
    const connRef = draw.connectors[i];
    const conn = connectorsList[connRef.id];

    let newPositions = [...conn.endPoints];
    newPositions[connRef.endPoint].x =
      conn.endPoints[connRef.endPoint].x + onMouseMovePositionVariant.x;
    newPositions[connRef.endPoint].y =
      conn.endPoints[connRef.endPoint].y + onMouseMovePositionVariant.y;

    conn.endPoints = newPositions;
  }
  for (let c = 0; c < draw.childrens.length; c++) {
    const children = state.draws[draw.childrens[c]];
    updateConnectors(children, state, onMouseMovePositionVariant);
  }
};

const updateConnectorsFromResize = (draw, connectorsList, variants) => {
  for (let i = 0; i < draw.connectors.length; i++) {
    const connRef = draw.connectors[i];
    const conn = connectorsList[connRef.id];

    let varY,
      varX = 0;

    switch (connRef.angle) {
      case 0: //se w variar em valor diferente de x || se y variar +/- que variação de H|| se h variar
        varY = (variants.varH + variants.varY) / 2;
        varX = variants.varW;
        conn.endPoints[connRef.endPoint].x += varX;
        conn.endPoints[connRef.endPoint].y += varY;
        break;

      case 90:
        varY = variants.varY;
        varX = (variants.varW + variants.varX) / 2;
        conn.endPoints[connRef.endPoint].x += varX;
        conn.endPoints[connRef.endPoint].y += varY;

        break;

      case 180:
        varY = (variants.varH + variants.varY) / 2;
        varX = variants.varX;
        conn.endPoints[connRef.endPoint].x += varX;
        conn.endPoints[connRef.endPoint].y += varY;

        break;

      case 270:
        varY = variants.varH;
        varX = (variants.varW + variants.varX) / 2;
        conn.endPoints[connRef.endPoint].x += varX;
        conn.endPoints[connRef.endPoint].y += varY;

        break;
    }

    conn.endPoints = [...conn.endPoints];

    // const connectorPoints = elementsConnectorPointsCalculator(
    //   draw.type,
    //   draw.width,
    //   draw.heigth
    // );
    // const point = connectorPoints.find((el) => {
    //   return el.pointRef == connRef.centerVariant.pointRef;
    // });

    // draw.connectors[i].centerVariant = point;

    // let newPositions = [...conn.endPoints];

    // newPositions[connRef.endPoint].x = draw.x + point.x;
    // newPositions[connRef.endPoint].y = draw.y + point.y;

    // conn.endPoints = newPositions;
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

  const newPositions = {
    x: absolutePosition.x + variationX,
    y: absolutePosition.y + variationY,
    varX: variationX,
    varY: variationY,
    varW: variationW,
    varH: variationH,
  };

  updateConnectorsFromResize(parent, state.connectors, newPositions);

  parent.absolutePosition = { x: newPositions.x, y: newPositions.y };

  return newPositions;
};

const addChildrenInParent = (state, children) => {
  let parent = state.draws[children.parent];

  let newChildrens = [...parent.childrens, children.id];

  children.x = children.x - parent.absolutePosition.x;
  children.y = children.y - parent.absolutePosition.y;

  parent.childrens = newChildrens;
};

const addParentInChildren = (children, parentId) => {
  children.parent = parentId;
};

// const updateDroppedChildrenPosition = (children, absolutePosition) => {
//   const calcX = children.x - absolutePosition.x;
//   const calcY = children.y - absolutePosition.y;

//   children.x = calcX;
//   children.y = calcY;
// };

const updateChildrensPositionOnParentResize = (children, variation) => {
  children.x = children.x - variation.x;
  children.y = children.y - variation.y;
};

const resizeGrandParents = (state, parent, padding) => {
  if (!parent.parent) return;

  const grandParent = state.draws[parent.parent];
  let variationX = 0;
  let variationY = 0;
  let variationW = 0;
  let variationH = 0;
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
    let calcW = parent.x + parent.width + padding - variationX;
    variationW = calcW - grandParent.width;
    grandParent.width = calcW;
    isUpdated = true;
  }
  if (parent.y + parent.heigth - variationY > grandParent.heigth - padding) {
    let calcH = parent.y + parent.heigth + padding - variationY;
    variationH = calcH - grandParent.heigth;
    grandParent.heigth = calcH;
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

  const variations = {
    varX: variationX,
    varY: variationY,
    varW: variationW,
    varH: variationH,
  };

  updateConnectorsFromResize(grandParent, state.connectors, variations);

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
