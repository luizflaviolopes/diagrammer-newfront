import { clearConnectorSelection } from "./connectorsResolver";
import { removeFromArray } from "../helpers/arrayManipulation";
import { getPositionBoardRelative } from "../helpers/getPositionBoardRelative";
import {
  autoResize,
  manualResize,
  findLimitPointsFromDrawArray,
  repositionSiblingsFromManualResize,
  autoResizeFromResizeChildren,
  updateConnectorsFromResize,
} from "./calcs/resize";

const padding = 10;

export const selectDraw = (state, actionPayload) => {
  const drawId = actionPayload.id;
  //draw clicked to selection
  const selectedDraw = state.draws[drawId];

  //Shift Pressed?
  if (!actionPayload.shiftPressed) {
    clearDrawSelected(state);
  }

  newSelectedDraw(state, selectedDraw, actionPayload);
  state.sessionState.draggingElement = true;

  return state;
};

export const drawDragging = (state, actionPayload) => {
  let selecteds = state.sessionState.drawsSelected;
  let newPos = actionPayload.position;

  const mouseMovementZoomRelative = getPositionBoardRelative(
    actionPayload.boardView,
    newPos,
    true
  );

  for (let i = 0; i < selecteds.length; i++) {
    const draw = state.draws[selecteds[i]];
    updateDrawPosition(state, draw, mouseMovementZoomRelative);
  }

  return state;
};

export const drawdrop = (state, actionPayload) => {
  if (!actionPayload.resolverData)
    actionPayload.resolverData = {
      selecteds: state.sessionState.drawsSelected,
    };

  if (actionPayload.id) {
    const parent = state.draws[actionPayload.id];

    const positionBoardRelative = getPositionBoardRelative(
      actionPayload.boardView,
      actionPayload
    );

    parent.absolutePosition = positionBoardRelative;

    autoResize(state, parent, positionBoardRelative, padding);

    for (let a = 0; a < actionPayload.resolverData.selecteds.length; a++) {
      let droppedDraw = state.draws[actionPayload.resolverData.selecteds[a]];

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
    for (let a = 0; a < actionPayload.resolverData.selecteds.length; a++) {
      let selectedDraw = state.draws[actionPayload.resolverData.selecteds[a]];
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
    actionPayload.boardView,
    actionPayload.position
  );

  let newDraw = {
    type: actionPayload.type,
    text: "Element",
    ...positionBoardRelative,
    height: 100,
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

const newSelectedDraw = (state, drawSelected, actionPayload) => {
  const positionBoardRelative = getPositionBoardRelative(
    actionPayload.boardView,
    actionPayload.clientRectPosition
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

const updateDrawPosition = (state, draw, mouseMovementZoomRelative) => {
  const newDraw = { ...draw };

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

export const updateConnectors = (draw, state, onMouseMovePositionVariant) => {
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
  draw.absolutePosition.height = draw.height;
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
      top: draw.height - padding,
      right: padding,
      bottom: padding,
      left: draw.width - padding,
    };

  return state;
};

export const resizeDraw = (state, payload) => {
  const draw = state.draws[payload.id];

  const positionBoardRelative = getPositionBoardRelative(
    payload.boardView,
    payload.position
  );

  const drawLimitsBeforeResize = {
    top: draw.y,
    right: draw.x + draw.width,
    bottom: draw.y + draw.height,
    left: draw.x,
  };

  const variations = manualResize(
    state,
    draw,
    positionBoardRelative,
    payload.corner
  );

  updateConnectorsFromResize(draw, state.connectors, variations);

  const siblings = getSiblings(state, draw);

  repositionSiblingsFromManualResize(
    state,
    draw,
    siblings,
    variations,
    drawLimitsBeforeResize
  );

  if (draw.parent) {
    autoResizeFromResizeChildren(state, draw, 10);
  }

  return state;
};

export const getSiblings = (state, draw) => {
  let allChildrens;

  if (draw.parent) {
    const parent = state.draws[draw.parent];
    allChildrens = parent.childrens;
  } else {
    allChildrens = state.boardDrawShowOrder;
  }

  const siblings = [];

  for (let i = 0; i < allChildrens.length; i++) {
    if (allChildrens[i] != draw.id) {
      const children = state.draws[allChildrens[i]];
      siblings.push(children);
    }
  }

  return siblings;
};

export const changeText = (state, actionPayload) => {
  const draw = state.draws[actionPayload.id];

  const newDraw = { ...draw };
  newDraw.text = actionPayload.text;

  state.draws[actionPayload.id] = newDraw;

  return state;
};
