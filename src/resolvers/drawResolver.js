import elementsConnectorPointsCalculator from "../helpers/elementsConnectorPointsCalculator";
import { clearConnectorSelection } from "./connectorsResolver";
import { drop } from "../actions/drawing";
import { removeFromArray } from "../helpers/arrayManipulation";
import { getPositionBoardRelative } from "../helpers/getPositionBoardRelative";
import * as drawTypes from "../types/drawTypes";
import {
  autoResize,
  manualResize,
  findLimitPointsFromDrawArray,
} from "./calcs/resize";

const padding = 10;

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

    const positionBoardRelative = getPositionBoardRelative(
      state,
      actionPayload
    );

    parent.absolutePosition = positionBoardRelative;

    autoResize(state, parent, positionBoardRelative, padding);

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

  const positionBoardRelative = getPositionBoardRelative(
    state,
    actionPayload.position
  );

  let newDraw = {
    type: actionPayload.type,
    text: "",
    ...positionBoardRelative,
    heigth: 100,
    width: 100,
    id: newID,
    connectors: [],
    parent: undefined,
    childrens: [],
    absolutePosition: { ...positionBoardRelative },
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

  const mouseMovementZoomRelative = getPositionBoardRelative(
    state,
    posVariation,
    true
  );

  newDraw.x = draw.absolutePosition.x + mouseMovementZoomRelative.x;
  newDraw.y = draw.absolutePosition.y + mouseMovementZoomRelative.y;

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

const removeDrawFromBoard = (state, drawId) => {
  state.boardDrawZOrder = removeFromArray(state.boardDrawZOrder, +drawId);
};

export const startResizeDraw = (state, payload) => {
  clearAllSelections(state);

  const draw = state.draws[payload.id];

  draw.absolutePosition.x = draw.x;
  draw.absolutePosition.y = draw.y;
  draw.absolutePosition.heigth = draw.heigth;
  draw.absolutePosition.width = draw.width;

  let childrensIds = draw.childrens;
  let childrenElements = childrensIds.map((id) => {
    return state.draws[id];
  });

  for (let i = 0; i < childrenElements.length; i++) {
    let children = childrenElements[i];

    children.absolutePosition = { x: children.x, y: children.y };
  }

  if (childrensIds.length > 0) {
    const limits = findLimitPointsFromDrawArray(childrenElements);

    draw.limitPoints = {
      top: limits.top - padding,
      right: limits.right + padding,
      bottom: limits.bottom + padding,
      left: limits.left - padding,
    };
  } else
    draw.limitPoints = {
      top: draw.heigth - padding,
      right: padding,
      bottom: padding,
      left: draw.width - padding,
    };

  return state;
};

export const resizeDraw = (state, payload) => {
  const draw = state.draws[payload.id];

  manualResize(state, draw, payload.position, payload.corner);
  return state;
};
