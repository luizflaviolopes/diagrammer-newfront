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
  // if (!actionPayload.shiftPressed) {
  //   clearDrawSelected(state);
  // }

  newSelectedDraw(state, selectedDraw, actionPayload);
  state.sessionState.draggingElement = true;

  return state;
};

export const drawDragging = (state, actionPayload) => {
  let selecteds = actionPayload.selectedDraws;

  const mouseMovementZoomRelative = actionPayload.displacementRelative;

  for (let i = 0; i < selecteds.length; i++) {
    const draw = state.draws[selecteds[i]];
    updateDrawPosition(state, draw, mouseMovementZoomRelative);
  }

  return state;
};

// const attachSelecteds = (state) => {
//   state.boardDrawShowOrder = [...state.boardDrawZOrder];
// };

export const drawdrop = (state, actionPayload) => {
  if (
    Math.abs(actionPayload.displacementRelative.x) < 5 &&
    Math.abs(actionPayload.displacementRelative.y) < 5
  )
    return state;

  if (actionPayload.id) {
    const parent = state.draws[actionPayload.id];

    for (let a = 0; a < actionPayload.selectedDraws.length; a++) {
      let droppedDraw = state.draws[actionPayload.selectedDraws[a]];

      let oldAbsolutePosition = { ...droppedDraw.absolutePosition };

      droppedDraw.absolutePosition = {
        x: droppedDraw.x + actionPayload.displacementRelative.x,
        y: droppedDraw.y + actionPayload.displacementRelative.y,
      };

      if (!droppedDraw.parent) {
        removeDrawFromBoard(state, droppedDraw.id);
      } else {
        const lastParent = state.draws[droppedDraw.parent];
        removeChildrenInParent(lastParent, droppedDraw.id);
      }

      addParentInChildren(droppedDraw, actionPayload.id);
      addChildrenInParent(state, droppedDraw);

      if (
        oldAbsolutePosition.x.toFixed(2) !=
          droppedDraw.absolutePosition.x.toFixed(2) ||
        oldAbsolutePosition.y.toFixed(2) !=
          droppedDraw.absolutePosition.y.toFixed(2)
      )
        updateConnectors(
          droppedDraw,
          state,
          actionPayload.displacementRelative
        );
    }
    autoResize(state, parent, null, padding, actionPayload.selectedDraws);
  } else {
    //Remove parent from children when dropping draw on board
    for (let a = 0; a < actionPayload.selectedDraws.length; a++) {
      let selectedDraw = state.draws[actionPayload.selectedDraws[a]];

      let oldAbsolutePosition = { ...selectedDraw.absolutePosition };

      selectedDraw.absolutePosition = {
        x: selectedDraw.x + actionPayload.displacementRelative.x,
        y: selectedDraw.y + actionPayload.displacementRelative.y,
      };

      // const newPosition = {
      //   x: selectedDraw.lastMeasures.x + actionPayload.displacement.x,
      //   y: selectedDraw.lastMeasures.y + actionPayload.displacement.y,
      // };
      // selectDraw.lastMeasures = undefined;

      selectedDraw.x = selectedDraw.absolutePosition.x;
      selectedDraw.y = selectedDraw.absolutePosition.y;

      //selectedDraw.absolutePosition = { ...newPosition };

      if (selectedDraw.parent) {
        const lastParent = state.draws[selectedDraw.parent];
        removeChildrenInParent(lastParent, selectedDraw.id);
        selectedDraw.parent = undefined;
        state.boardDrawShowOrder = [
          ...state.boardDrawShowOrder,
          selectedDraw.id,
        ];
      }

      if (
        oldAbsolutePosition.x.toFixed(2) !=
          selectedDraw.absolutePosition.x.toFixed(2) ||
        oldAbsolutePosition.y.toFixed(2) !=
          selectedDraw.absolutePosition.y.toFixed(2)
      )
        updateConnectors(
          selectedDraw,
          state,
          actionPayload.displacementRelative
        );
    }
  }

  let newSession = { ...state.sessionState };
  newSession.draggingElement = false;

  state.sessionState = newSession;
  return state;
};

export const drawAdd = (state, actionPayload) => {
  const newID = state.counters.draws++;

  const positionBoardRelative = actionPayload.positionRelative;

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
  // state.boardDrawZOrder = [...state.boardDrawZOrder, newID];
  state.boardDrawShowOrder = [...state.boardDrawShowOrder, newID];

  return state;
};

export const clearAllSelections = (state, actionPayload) => {
  clearDrawSelected(state);
  clearConnectorSelection(state);
  return state;
};

export const clearDrawSelected = (state) => {
  // let list = state.sessionState.drawsSelected;
  // for (let i = 0; i < list.length; i++) {
  //   let actualDraw = state.draws[list[i]];
  //   actualDraw.selected = false;
  //   if (actualDraw.parent) addChildrenInParent(state, actualDraw);
  // }
  // state.sessionState.drawsSelected = [];
  // state.boardDrawShowOrder = [...state.boardDrawZOrder];
};

const newSelectedDraw = (state, drawSelected, actionPayload) => {
  const positionBoardRelative = actionPayload.clientRectPositionRelative;

  drawSelected.absolutePosition = {
    x: positionBoardRelative.x,
    y: positionBoardRelative.y,
  };

  //if (!drawSelected.selected) {
  //drawSelected.selected = true;

  //drawSelected.x = positionBoardRelative.x;
  //drawSelected.y = positionBoardRelative.y;

  // state.sessionState.drawsSelected = [
  //   ...state.sessionState.drawsSelected,
  //   drawSelected.id,
  // ];

  // if (drawSelected.parent) {
  //   detachChildrenFromParentOnSelect(
  //     state.draws[drawSelected.parent],
  //     drawSelected.id
  //   );
  // }

  // ##remover do showorder
  // let drawsUnremoved = removeFromArray(
  //   state.boardDrawShowOrder,
  //   +drawSelected.id
  // );

  //state.boardDrawShowOrder = drawsUnremoved;
  //}
};

// const detachChildrenFromParentOnSelect = (parent, children_id) => {
//   parent.childrens = removeFromArray(parent.childrens, children_id);
// };

const updateDrawPosition = (state, draw, mouseMovementZoomRelative) => {
  const newDraw = { ...draw };

  newDraw.absolutePosition = {
    x: newDraw.absolutePosition.x + mouseMovementZoomRelative.x,
    y: newDraw.absolutePosition.y + mouseMovementZoomRelative.y,
  };

  state.draws[draw.id] = newDraw;

  updateConnectors(draw, state, mouseMovementZoomRelative);
};

// const updateDrawLastPosition = (state, draw) => {
//   draw.absolutePosition = {
//     y: draw.x,
//     y: draw.y,
//   };
//   updateChildrensLastPosition(state, draw);
// };

// const updateChildrensLastPosition = (state, draw) => {
//   for (let i = 0; i < draw.childrens.length; i++) {
//     const children = state.draws[draw.childrens[i]];

//     updateDrawLastPosition(state, children);
//   }
// };

export const updateConnectors = (draw, state, onMouseMovePositionVariant) => {
  const connectorsList = state.connectors;
  for (let i = 0; i < draw.connectors.length; i++) {
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

  children.x = children.absolutePosition.x - parent.absolutePosition.x;
  children.y = children.absolutePosition.y - parent.absolutePosition.y;

  parent.childrens = newChildrens;
};

const addParentInChildren = (children, parentId) => {
  children.parent = parentId;
};

const removeDrawFromBoard = (state, drawId) => {
  state.boardDrawShowOrder = removeFromArray(state.boardDrawShowOrder, +drawId);
};
const removeChildrenInParent = (parent, idChildrenToRemove) => {
  parent.childrens = removeFromArray(parent.childrens, +idChildrenToRemove);
};

export const startResizeDraw = (state, payload) => {
  clearAllSelections(state);

  const draw = state.draws[payload.id];

  draw.lastMeasures = {
    x: draw.x,
    y: draw.y,
    height: draw.height,
    width: draw.width,
    absoluteX: draw.absolutePosition.x,
    absoluteY: draw.absolutePosition.y,
  };

  let childrensIds = draw.childrens;
  let childrenElements = childrensIds.map((id) => {
    return state.draws[id];
  });

  // for (let i = 0; i < childrenElements.length; i++) {
  //   let children = childrenElements[i];

  //   children.absolutePosition = { x: children.x, y: children.y };
  // }

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

  const displacementBoardRelative = payload.displacementRelative;

  const drawLimitsBeforeResize = {
    top: draw.y,
    right: draw.x + draw.width,
    bottom: draw.y + draw.height,
    left: draw.x,
  };

  const variations = manualResize(
    state,
    draw,
    displacementBoardRelative,
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

export const endResize = (state, payload) => {
  const draw = state.draws[payload.id];

  if (
    draw.height == draw.lastMeasures.height &&
    draw.width == draw.lastMeasures.width
  )
    return resizeDraw(state, payload);
  else return state;
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
