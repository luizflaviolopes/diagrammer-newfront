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
import { isDragging } from "../data/offContext";
import {
  elementChange,
  connectorChange,
} from "../dataControllers/changeDataControl";

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
  return state;
};

export const drawDragging = (state, actionPayload) => {
  let selecteds = actionPayload.selectedDraws;

  const mouseMovementZoomRelative = actionPayload.displacement;
  const selectedsIds = Object.keys(selecteds);

  for (let i = 0; i < selectedsIds.length; i++) {
    const draw = state.draws[selectedsIds[i]];
    updateDrawPosition(state, draw, mouseMovementZoomRelative);
  }

  return state;
};

export const drawdrop = (state, actionPayload) => {
  //discard drops in same place
  if (!actionPayload) return state;

  if (actionPayload.id) {
    const parent = state.draws[actionPayload.id];
    const selectedsIds = Object.keys(actionPayload.selectedDraws);

    for (let a = 0; a < selectedsIds.length; a++) {
      let droppedDraw = state.draws[selectedsIds[a]];

      elementChange(droppedDraw);

      const oldAbsolute = { ...droppedDraw.absolutePosition };

      droppedDraw.absolutePosition = {
        x:
          actionPayload.selectedDraws[selectedsIds[a]].absolutePosition.x +
          actionPayload.completeDisplacement.x,
        y:
          actionPayload.selectedDraws[selectedsIds[a]].absolutePosition.y +
          actionPayload.completeDisplacement.y,
      };

      const displacementForConnectors = {
        x: droppedDraw.absolutePosition.x - oldAbsolute.x,
        y: droppedDraw.absolutePosition.y - oldAbsolute.y,
      };

      if (!droppedDraw.parent) {
        removeDrawFromBoard(state, droppedDraw.id);
      } else {
        const lastParent = state.draws[droppedDraw.parent];
        removeChildrenInParent(lastParent, droppedDraw.id);
      }

      addParentInChildren(droppedDraw, actionPayload.id);
      addChildrenInParent(state, droppedDraw);

      if (displacementForConnectors.x != 0 && displacementForConnectors.y != 0)
        updateConnectors(droppedDraw, state, displacementForConnectors);
    }
    autoResize(state, parent, null, padding, actionPayload.selectedDraws);
  } else {
    const selectedsIds = Object.keys(actionPayload.selectedDraws);

    //Remove parent from children when dropping draw on board
    for (let a = 0; a < selectedsIds.length; a++) {
      let droppedDraw = state.draws[selectedsIds[a]];

      const oldAbsolute = { ...droppedDraw.absolutePosition };

      droppedDraw.absolutePosition = {
        x:
          actionPayload.selectedDraws[selectedsIds[a]].absolutePosition.x +
          actionPayload.completeDisplacement.x,
        y:
          actionPayload.selectedDraws[selectedsIds[a]].absolutePosition.y +
          actionPayload.completeDisplacement.y,
      };

      const displacementForConnectors = {
        x: droppedDraw.absolutePosition.x - oldAbsolute.x,
        y: droppedDraw.absolutePosition.y - oldAbsolute.y,
      };

      // const newPosition = {
      //   x: selectedDraw.lastMeasures.x + actionPayload.displacement.x,
      //   y: selectedDraw.lastMeasures.y + actionPayload.displacement.y,
      // };
      // selectDraw.lastMeasures = undefined;

      droppedDraw.x = droppedDraw.absolutePosition.x;
      droppedDraw.y = droppedDraw.absolutePosition.y;

      //selectedDraw.absolutePosition = { ...newPosition };

      if (droppedDraw.parent) {
        const lastParent = state.draws[droppedDraw.parent];
        removeChildrenInParent(lastParent, droppedDraw.id);
        droppedDraw.parent = undefined;
        state.boardDrawShowOrder = [
          ...state.boardDrawShowOrder,
          droppedDraw.id,
        ];
      }

      if (displacementForConnectors.x != 0 && displacementForConnectors.y != 0)
        updateConnectors(droppedDraw, state, displacementForConnectors);
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

  elementChange({ id: newID });

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

  elementChange(newDraw);

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

    connectorChange(conn);

    conn.endPoints = newPositions;
  }
  for (let c = 0; c < draw.childrens.length; c++) {
    const children = state.draws[draw.childrens[c]];
    updateConnectors(children, state, onMouseMovePositionVariant);
  }
};

const addChildrenInParent = (state, children) => {
  let parent = state.draws[children.parent];

  elementChange(parent);
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
  elementChange(parent);
  parent.childrens = removeFromArray(parent.childrens, +idChildrenToRemove);
};

export const startResizeDraw = (state, payload) => {
  // clearAllSelections(state);

  const draw = state.draws[payload.id];
  elementChange(draw);

  draw.lastMeasures = {
    x: draw.x,
    y: draw.y,
    height: draw.height,
    width: draw.width,
    absoluteX: draw.absolutePosition.x,
    absoluteY: draw.absolutePosition.y,
  };

  // for (let i = 0; i < childrenElements.length; i++) {
  //   let children = childrenElements[i];

  //   children.absolutePosition = { x: children.x, y: children.y };
  // }

  draw.limitPoints = getResizeLimit(state, draw);

  return state;
};

const getResizeLimit = (state, draw) => {
  let childrensIds = draw.childrens;
  let childrenElements = childrensIds.map((id) => {
    return state.draws[id];
  });

  if (childrensIds.length > 0) {
    const limits = findLimitPointsFromDrawArray(childrenElements);

    return {
      top: draw.height - (limits.top - padding),
      right: limits.right + padding,
      bottom: limits.bottom + padding,
      left: draw.width - (limits.left - padding),
    };
  } else
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding,
    };
};

export const resizeDraw = (state, payload) => {
  const draw = state.draws[payload.id];

  const displacementBoardRelative = payload.displacement;

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

export const endResize = (state, actionPayload) => {
  const draw = state.draws[actionPayload.id];

  // if (!draw.lastMeasures) {
  //   draw.limitPoints = getResizeLimit(state, draw);
  //   draw.lastMeasures = {
  //     x: draw.x,
  //     y: draw.y,
  //     height: draw.height,
  //     width: draw.width,
  //     absoluteX: draw.absolutePosition.x,
  //     absoluteY: draw.absolutePosition.y,
  //   };

  //   const resizeReturn = resizeDraw(state, actionPayload);
  //   draw.limitPoints = undefined;
  //   draw.lastMeasures = undefined;

  //   return resizeReturn;
  // } else {
  draw.limitPoints = undefined;
  draw.lastMeasures = undefined;
  return state;
  // }
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
  elementChange(draw);

  const newDraw = { ...draw };
  newDraw.text = actionPayload.text;

  state.draws[actionPayload.id] = newDraw;

  return state;
};
