import {
  connectorChange,
  elementChange,
} from "../../dataControllers/changeDataControl";
import * as drawTypes from "../../types/drawTypes";
import { getSiblings } from "../drawResolver";

export const autoResize = (
  state,
  parent,
  positionBoardRelative,
  padding,
  selectedIds
) => {
  autoResizeFromDropChildren(
    state,
    parent,
    positionBoardRelative,
    padding,
    selectedIds
  );
};

export const findLimitPointsFromDrawArray = (elementArray, isAbsolute) => {
  const firstElement = elementArray[0];
  let childrenLimitPoints = {};

  if (isAbsolute) {
    childrenLimitPoints = {
      left: firstElement.absolutePosition.x,
      top: firstElement.absolutePosition.y,
      right: firstElement.absolutePosition.x + firstElement.width,
      bottom: firstElement.absolutePosition.y + firstElement.height,
    };

    for (let z = 1; z < elementArray.length; z++) {
      let elementSelected = elementArray[z];
      if (elementSelected.absolutePosition.x < childrenLimitPoints.left)
        childrenLimitPoints.left = elementSelected.absolutePosition.x;
      if (elementSelected.absolutePosition.y < childrenLimitPoints.top)
        childrenLimitPoints.top = elementSelected.absolutePosition.y;
      if (
        elementSelected.absolutePosition.x + elementSelected.width >
        childrenLimitPoints.right
      )
        childrenLimitPoints.right =
          elementSelected.absolutePosition.x + elementSelected.width;
      if (
        elementSelected.absolutePosition.y + elementSelected.height >
        childrenLimitPoints.bottom
      )
        childrenLimitPoints.bottom =
          elementSelected.absolutePosition.y + elementSelected.height;
    }
  } else {
    childrenLimitPoints = {
      left: firstElement.x,
      top: firstElement.y,
      right: firstElement.x + firstElement.width,
      bottom: firstElement.y + firstElement.height,
    };

    for (let z = 1; z < elementArray.length; z++) {
      let elementSelected = elementArray[z];
      if (elementSelected.x < childrenLimitPoints.left)
        childrenLimitPoints.left = elementSelected.x;
      if (elementSelected.y < childrenLimitPoints.top)
        childrenLimitPoints.top = elementSelected.y;
      if (elementSelected.x + elementSelected.width > childrenLimitPoints.right)
        childrenLimitPoints.right = elementSelected.x + elementSelected.width;
      if (
        elementSelected.y + elementSelected.height >
        childrenLimitPoints.bottom
      )
        childrenLimitPoints.bottom = elementSelected.y + elementSelected.height;
    }
  }

  return childrenLimitPoints;
};

const autoResizeFromDropChildren = (
  state,
  parent,
  positionBoardRelative,
  padding,
  selectedsIds
) => {
  let selectedDraws = Object.keys(selectedsIds).map((id) => {
    return state.draws[id];
  });

  let childrenLimitPoints = findLimitPointsFromDrawArray(selectedDraws, true);

  let drawLimitPoints = {
    left: parent.absolutePosition.x,
    top: parent.absolutePosition.y,
    right: parent.absolutePosition.x + parent.width,
    bottom: parent.absolutePosition.y + parent.height,
  };

  autoResizeParent(
    state,
    parent,
    childrenLimitPoints,
    drawLimitPoints,
    padding
  );
};

export const autoResizeFromResizeChildren = (state, children, padding) => {
  const parent = state.draws[children.parent];

  let childrens = parent.childrens.map((id) => {
    return state.draws[id];
  });

  let childrenLimitPoints = findLimitPointsFromDrawArray(childrens);

  let drawLimitPoints = {
    left: 0,
    top: 0,
    right: parent.width,
    bottom: parent.height,
  };

  autoResizeParent(
    state,
    parent,
    childrenLimitPoints,
    drawLimitPoints,
    padding
  );
};

const autoResizeParent = (
  state,
  parent,
  childrenLimits,
  drawLimits,
  padding
) => {
  autoResizeDraws(state, parent, padding, childrenLimits, drawLimits);

  if (parent.parent) {
    let grandParent = state.draws[parent.parent];
    autoResizeGrandParent(state, parent, grandParent, padding);
  }
};

const autoResizeGrandParent = (state, parent, grandParent, padding) => {
  let childrenLimitPoints = {
    left: parent.x,
    top: parent.y,
    right: parent.x + parent.width,
    bottom: parent.y + parent.height,
  };

  let drawLimitPoints = {
    left: 0,
    top: 0,
    right: grandParent.width,
    bottom: grandParent.height,
  };

  const variations = autoResizeDraws(
    state,
    grandParent,
    padding,
    childrenLimitPoints,
    drawLimitPoints
  );

  if (grandParent.parent) {
    let greatGrandParent = state.draws[grandParent.parent];
    autoResizeGrandParent(state, grandParent, greatGrandParent, padding);
  }

  return variations;
};

const autoResizeDraws = (
  state,
  draw,
  padding,
  childrensLimitPoints,
  drawLimitPoints
) => {
  const drawLimitsBeforeResize = {
    top: draw.y,
    right: draw.x + draw.width,
    bottom: draw.y + draw.height,
    left: draw.x,
  };

  let variationsFromResize;

  variationsFromResize = resizeRect(
    draw,
    padding,
    childrensLimitPoints,
    drawLimitPoints
  );

  repositionChildrens(state, draw, {
    x: variationsFromResize.varW,
    y: variationsFromResize.varN,
  });

  updateConnectorsFromResize(draw, state.connectors, variationsFromResize);

  draw.absolutePosition = {
    x: draw.absolutePosition.x + variationsFromResize.varW,
    y: draw.absolutePosition.y + variationsFromResize.varN,
  };

  const siblings = getSiblings(state, draw);

  repositionSiblingsFromManualResize(
    state,
    draw,
    siblings,
    variationsFromResize,
    drawLimitsBeforeResize
  );
};

const repositionChildrens = (state, drawUpdated, variationsXY) => {
  //é possível aumentar a performance, separando o calculo para x e y.
  if (variationsXY.x < 0 || variationsXY.y < 0) {
    for (let c = 0; c < drawUpdated.childrens.length; c++) {
      const children = state.draws[drawUpdated.childrens[c]];
      elementChange(children);
      updateChildrensPositionOnParentResize(children, variationsXY);
    }
  }
};

// const updateParentSizeCircle = (
//   state,
//   parent,
//   absolutePosition,
//   paddingFull
// ) => {
//   const padding = paddingFull / 2;
//   const radius = Math.max(parent.width, parent.height) / 2;

//   let variationX = 0;
//   let variationY = 0;
//   let variationH = 0;
//   let variationW = 0;

//   const calcHipotenusa = (pointA, PointB) => {
//     const adjacent = Math.abs(pointA.x - PointB.x);
//     const oposite = Math.abs(pointA.y - PointB.y);

//     return Math.sqrt(adjacent * adjacent + oposite * oposite);
//   };

//   let selecteds = state.sessionState.drawsSelected;

//   const rectToCircleDiagonal = Math.sqrt(2 * (radius * radius)) - radius;
//   const rectToCircle = Math.sqrt(
//     (rectToCircleDiagonal * rectToCircleDiagonal) / 2
//   );

//   let pointTopLeft = {
//     x: parent.x + rectToCircle,
//     y: parent.y + rectToCircle,
//   };
//   let pointTopRight = {
//     x: parent.x + parent.width - rectToCircle,
//     y: parent.y + rectToCircle,
//   };
//   let pointBottomRight = {
//     x: parent.x + parent.width - rectToCircle,
//     y: parent.y + parent.height - rectToCircle,
//   };
//   let pointBottomLeft = {
//     x: parent.x + rectToCircle,
//     y: parent.y + parent.height - rectToCircle,
//   };

//   for (let z = 0; z < selecteds.length; z++) {
//     const dropped = state.draws[selecteds[z]];

//     if (dropped.x + dropped.y < pointTopLeft.x + pointTopLeft.y)
//       pointTopLeft = { x: dropped.x, y: dropped.y };

//     if (
//       (dropped.x + dropped.width) / dropped.y >
//       pointTopRight.x / pointTopRight.y
//     )
//       pointTopRight = { x: dropped.x + dropped.width, y: dropped.y };

//     if (
//       (dropped.x + dropped.width) * (dropped.y + dropped.height) >
//       pointBottomRight.x * pointBottomRight.y
//     )
//       pointBottomRight = {
//         x: dropped.x + dropped.width,
//         y: dropped.y + dropped.height,
//       };

//     if (
//       (dropped.y + dropped.height) / dropped.x >
//       pointBottomLeft.y / pointBottomLeft.x
//     )
//       pointBottomLeft = { x: dropped.x, y: dropped.y + dropped.height };
//   }

//   const centerX =
//     (pointTopLeft.x +
//       pointTopRight.x +
//       pointBottomRight.x +
//       pointBottomLeft.x) /
//     4;
//   const centerY =
//     (pointTopLeft.y +
//       pointTopRight.y +
//       pointBottomRight.y +
//       pointBottomLeft.y) /
//     4;

//   const centerPoint = { x: centerX, y: centerY };

//   parent.resizePoints = [
//     pointTopLeft,
//     pointTopRight,
//     pointBottomRight,
//     pointBottomLeft,
//     centerPoint,
//   ];

//   // const topLine = calcHipotenusa(pointTopLeft,pointTopRight);
//   // const rigthLine = calcHipotenusa(pointTopLeft,pointTopRight);

//   const distanceToTopLeft = calcHipotenusa(centerPoint, pointTopLeft);
//   const distanceToTopRigth = calcHipotenusa(centerPoint, pointTopRight);
//   const distanceToBottomRigth = calcHipotenusa(centerPoint, pointBottomRight);
//   const distanceToBottomLeft = calcHipotenusa(centerPoint, pointBottomLeft);

//   const pointsDistancesToCenter = [
//     distanceToTopLeft,
//     distanceToTopRigth,
//     distanceToBottomRigth,
//     distanceToBottomLeft,
//   ];

//   //pointsDistancesToCenter.push(parent.width / 2);

//   const newRadius = Math.max(...pointsDistancesToCenter);

//   const newPosition = {
//     x: centerPoint.x - newRadius,
//     y: centerPoint.y - newRadius,
//   };

//   variationX = newPosition.x - parent.x;
//   variationY = newPosition.y - parent.y;
//   variationH = newRadius - parent.height;
//   variationW = newRadius - parent.width;

//   parent.x = newPosition.x;
//   parent.y = newPosition.y;
//   parent.height = newRadius * 2;
//   parent.width = newRadius * 2;

//   const newPositions = {
//     x: absolutePosition.x + variationX,
//     y: absolutePosition.y + variationY,
//     varX: variationX,
//     varY: variationY,
//     varW: variationW,
//     varH: variationH,
//   };

//   updateConnectorsFromResize(parent, state.connectors, newPositions);

//   parent.absolutePosition = { x: newPositions.x, y: newPositions.y };

//   return newPositions;
// };

export const updateConnectorsFromResize = (
  draw,
  connectorsList,
  variants,
  isSibling
) => {
  for (let i = 0; i < draw.connectors.length; i++) {
    const connRef = draw.connectors[i];
    const conn = connectorsList[connRef.id];

    let varY, varX;

    switch (connRef.angle) {
      case 0: //se w variar em valor diferente de x || se y variar +/- que variação de H|| se h variar
        varY = (variants.varS + variants.varN) / 2;
        varX = variants.varE;
        conn.endPoints[connRef.endPoint].x += varX;
        conn.endPoints[connRef.endPoint].y += varY;
        break;

      case 90:
        varY = variants.varN;
        varX = (variants.varW + variants.varE) / 2;
        conn.endPoints[connRef.endPoint].x += varX;
        conn.endPoints[connRef.endPoint].y += varY;

        break;

      case 180:
        varY = (variants.varS + variants.varN) / 2;
        varX = variants.varW;
        conn.endPoints[connRef.endPoint].x += varX;
        conn.endPoints[connRef.endPoint].y += varY;

        break;

      case 270:
        varY = variants.varS;
        varX = (variants.varW + variants.varE) / 2;
        conn.endPoints[connRef.endPoint].x += varX;
        conn.endPoints[connRef.endPoint].y += varY;

        break;
    }

    connectorChange(conn);
    conn.endPoints = [...conn.endPoints];
  }
};

export const updateConnectorsFromRepositionSibling = (
  draw,
  connectorsList,
  variants,
  isSibling
) => {
  for (let i = 0; i < draw.connectors.length; i++) {
    const connRef = draw.connectors[i];
    const conn = connectorsList[connRef.id];

    const varY = variants.varS + variants.varN;
    const varX = variants.varW + variants.varE;

    conn.endPoints[connRef.endPoint].x += varX;
    conn.endPoints[connRef.endPoint].y += varY;

    connectorChange(conn);
    conn.endPoints = [...conn.endPoints];
  }
};

const updateChildrensPositionOnParentResize = (children, variation) => {
  children.x = children.x - variation.x;
  children.y = children.y - variation.y;
};

const resizeRect = (
  drawToResize,
  padding,
  childrensLimitPoints,
  drawLimitPoints
) => {
  let variations = {
    varN: 0,
    varE: 0,
    varS: 0,
    varW: 0,
  };

  let isUpdated = false;

  //comparando esquerda
  if (childrensLimitPoints.left - padding < drawLimitPoints.left) {
    variations.varW =
      childrensLimitPoints.left - padding - drawLimitPoints.left;

    elementChange(drawToResize);

    drawToResize.x += variations.varW;
    drawToResize.width -= variations.varW;
    isUpdated = true;
  }

  //comparando topo
  if (childrensLimitPoints.top - padding < drawLimitPoints.top) {
    variations.varN = childrensLimitPoints.top - padding - drawLimitPoints.top;

    elementChange(drawToResize);

    drawToResize.y += variations.varN;
    drawToResize.height -= variations.varN;
    isUpdated = true;
  }

  //comparando direita
  if (childrensLimitPoints.right + padding > drawLimitPoints.right) {
    //calcular nova largura
    variations.varE =
      childrensLimitPoints.right + padding - drawLimitPoints.right;

    elementChange(drawToResize);

    //incluir variação em largura
    drawToResize.width += variations.varE;
    isUpdated = true;
  }

  //comparando baixo
  if (childrensLimitPoints.bottom + padding > drawLimitPoints.bottom) {
    //calcular nova altura
    variations.varS =
      childrensLimitPoints.bottom + padding - drawLimitPoints.bottom;

    elementChange(drawToResize);

    //definir nova altura
    drawToResize.height += variations.varS;
    isUpdated = true;
  }

  variations.isUpdated = isUpdated;

  return variations;
};

const resizeCircle = (
  drawToResize,
  padding,
  childrensLimitPoints,
  drawLimitPoints
) => {
  const calcPointsDistance = (pointA, pointB) => {
    const xDiff = Math.abs(pointA.x - pointB.x);
    const yDiff = Math.abs(pointA.y - pointB.y);

    const distance = Math.sqrt((xDiff ^ 2) + (yDiff ^ 2));
    return distance;
  };

  //precisa checar se a distancia dos limites pro foco da elipse são maiores que o atual pra saber se o resize é necessário

  const sqrt = Math.sqrt(2);

  const drawCenter = {
    x: (drawLimitPoints.right + drawLimitPoints.left) / 2,
    y: (drawLimitPoints.bottom + drawLimitPoints.top) / 2,
  };

  const boxInsideEllipseMeasures = {
    w: (drawLimitPoints.right - drawCenter.x) * sqrt - padding,
    h: (drawLimitPoints.bottom - drawCenter.y) * sqrt - padding,
  };

  const boxInsideEllipseLimits = {
    left: drawCenter.x - boxInsideEllipseMeasures.w / 2,
    top: drawCenter.y - boxInsideEllipseMeasures.h / 2,
    right: drawCenter.x + boxInsideEllipseMeasures.w / 2,
    bottom: drawCenter.y + boxInsideEllipseMeasures.h / 2,
  };

  const newDrawLimits = {
    left:
      childrensLimitPoints.left < boxInsideEllipseLimits.left
        ? childrensLimitPoints.left
        : boxInsideEllipseLimits.left,
    right:
      childrensLimitPoints.right > boxInsideEllipseLimits.right
        ? childrensLimitPoints.right
        : boxInsideEllipseLimits.right,
    top:
      childrensLimitPoints.top < boxInsideEllipseLimits.top
        ? childrensLimitPoints.top
        : boxInsideEllipseLimits.top,
    bottom:
      childrensLimitPoints.bottom > boxInsideEllipseLimits.bottom
        ? childrensLimitPoints.bottom
        : boxInsideEllipseLimits.bottom,
  };

  const center = {
    x: (newDrawLimits.left + newDrawLimits.right) / 2,
    y: (newDrawLimits.top + newDrawLimits.bottom) / 2,
  };

  const limitMeasures = {
    w: newDrawLimits.right - newDrawLimits.left + padding,
    h: newDrawLimits.bottom - newDrawLimits.top + padding,
  };

  const ellipseMeasures = {
    w: (limitMeasures.w / sqrt) * 2,
    h: (limitMeasures.h / sqrt) * 2,
  };

  ellipseMeasures.x = center.x - ellipseMeasures.w / 2;
  ellipseMeasures.y = center.y - ellipseMeasures.h / 2;

  const newPosition = {
    x: ellipseMeasures.x,
    y: ellipseMeasures.y,
  };

  const variations = {
    varN: ellipseMeasures.y - drawLimitPoints.top,
    varE: ellipseMeasures.x + ellipseMeasures.w - drawLimitPoints.right,
    varS: ellipseMeasures.y + ellipseMeasures.h - drawLimitPoints.bottom,
    varW: ellipseMeasures.x - drawLimitPoints.left,
  };

  drawToResize.x += variations.varW;
  drawToResize.y += variations.varN;
  drawToResize.height += variations.varS - variations.varN;
  drawToResize.width += variations.varE - variations.varW;

  return variations;
};

export const manualResize = (state, draw, dragPosition, corner) => {
  const limitpoints = draw.limitPoints;

  const variations = {
    varN: 0,
    varE: 0,
    varS: 0,
    varW: 0,
  };

  for (let i = 0; i < corner.length; i++) {
    const side = corner[i];

    switch (side) {
      case "n":
        const variationY = resizeN(draw, dragPosition, limitpoints.top);
        repositionChildrensFromAbsolutePosition(state, draw, variationY);
        variations.varN = variationY.relative;
        break;
      case "e":
        const variationE = resizeE(draw, dragPosition, limitpoints.right);
        variations.varE = variationE;
        break;
      case "s":
        const variationS = resizeS(draw, dragPosition, limitpoints.bottom);
        variations.varS = variationS;
        break;
      case "w":
        const variationX = resizeW(draw, dragPosition, limitpoints.left);
        repositionChildrensFromAbsolutePosition(state, draw, variationX);
        variations.varW = variationX.relative;
        break;
    }
  }

  return variations;
};

const resizeN = (draw, position, limit) => {
  let variation = position.y;
  // const lastY = draw.y;

  if (draw.height - variation < limit)
    return { y: 0, x: undefined, relative: 0 };

  draw.y += variation;
  draw.absolutePosition.y += variation;
  draw.height -= variation;

  return { y: variation, x: undefined, relative: variation };
};
const resizeE = (draw, position, limit) => {
  const variation = position.x;
  // const lastWidth = draw.width;
  let newWidth = draw.width + variation;

  if (newWidth < limit) newWidth = limit;
  draw.width = newWidth;

  return variation;
};
const resizeS = (draw, position, limit) => {
  const variation = position.y;
  // const lastHeight = draw.height;
  let newheight = draw.height + variation;

  if (newheight < limit) newheight = limit;
  draw.height = newheight;

  return variation;
};
const resizeW = (draw, position, limit) => {
  let variation = position.x;
  // const lastX = draw.x;

  if (draw.width - variation < limit)
    return { x: 0, y: undefined, relative: 0 };

  draw.x += variation;
  draw.absolutePosition.x += variation;
  draw.width -= variation;

  return { x: variation, y: undefined, relative: variation };
};

const repositionChildrensFromAbsolutePosition = (
  state,
  drawUpdated,
  variation
) => {
  //é possível aumentar a performance, separando o calculo para x e y.
  if (variation.x != undefined)
    for (let c = 0; c < drawUpdated.childrens.length; c++) {
      let children = state.draws[drawUpdated.childrens[c]];

      children.x -= variation.x;
    }
  if (variation.y != undefined) {
    for (let c = 0; c < drawUpdated.childrens.length; c++) {
      let children = state.draws[drawUpdated.childrens[c]];

      children.y -= variation.y;
    }
  }
};

export const repositionSiblingsFromManualResize = (
  state,
  draw,
  siblings,
  variations,
  drawLimitsBeforeResize
) => {
  const margin = 20;

  const drawLimits = {
    get top() {
      return draw.y;
    },
    get right() {
      return draw.x + draw.width;
    },
    get bottom() {
      return draw.y + draw.height;
    },
    get left() {
      return draw.x;
    },
  };

  let isRepositioned = false;

  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];

    if (draw.id == siblings[i].id) continue;

    const varToConnectors = {
      varN: 0,
      varE: 0,
      varS: 0,
      varW: 0,
    };

    const siblingLimits = {
      get top() {
        return sibling.y;
      },
      get right() {
        return sibling.x + sibling.width;
      },
      get bottom() {
        return sibling.y + sibling.height;
      },
      get left() {
        return sibling.x;
      },
    };

    const limitsBeforeReposition = {
      top: sibling.y,
      right: sibling.x + sibling.width,
      bottom: sibling.y + sibling.height,
      left: sibling.x,
    };

    let positionChanged = false;

    const checkRepositionCaller = (hemisphere) =>
      checkIfRepositionNeeded(
        drawLimits,
        drawLimitsBeforeResize,
        siblingLimits,
        hemisphere
      );

    if (variations.varN < 0 && checkRepositionCaller("n")) {
      elementChange(sibling);
      sibling.y += variations.varN;
      varToConnectors.varS = variations.varN;
      positionChanged = true;
    }

    if (variations.varE > 0 && checkRepositionCaller("e")) {
      elementChange(sibling);
      sibling.x += variations.varE;
      varToConnectors.varW = variations.varE;
      positionChanged = true;
    }

    if (variations.varS > 0 && checkRepositionCaller("s")) {
      elementChange(sibling);
      sibling.y += variations.varS;
      varToConnectors.varN = variations.varS;
      positionChanged = true;
    }

    if (variations.varW < 0 && checkRepositionCaller("w")) {
      elementChange(sibling);
      sibling.x += variations.varW;
      varToConnectors.varE = variations.varW;
      positionChanged = true;
    }

    if (positionChanged) {
      isRepositioned = true;
      elementChange(draw);

      updateConnectorsFromRepositionSibling(
        sibling,
        state.connectors,
        varToConnectors,
        true
      );

      repositionSiblingsFromManualResize(
        state,
        sibling,
        siblings,
        variations,
        limitsBeforeReposition
      );
    }
  }

  if (draw.parent && isRepositioned) {
    autoResizeFromResizeChildren(state, draw, 10);
  }
};

const checkIfRepositionNeeded = (
  drawLimits,
  drawAbsoluteLimits,
  siblingLimits,
  hemisphere
) => {
  const margin = 20;
  switch (hemisphere) {
    case "n":
      //verificar bottom
      if (
        siblingLimits.bottom < drawAbsoluteLimits.top &&
        siblingLimits.bottom > drawLimits.top - margin
      ) {
        if (
          siblingLimits.right > drawLimits.left - margin &&
          siblingLimits.right < drawLimits.right + margin
        )
          return true;
        if (
          siblingLimits.left < drawLimits.right + margin &&
          siblingLimits.left > drawLimits.left - margin
        )
          return true;
      }
      break;
    case "e":
      if (
        siblingLimits.left > drawAbsoluteLimits.right &&
        siblingLimits.left < drawLimits.right + margin
      ) {
        if (
          siblingLimits.bottom > drawLimits.top - margin &&
          siblingLimits.bottom < drawLimits.bottom + margin
        )
          return true;
        if (
          siblingLimits.top > drawLimits.top - margin &&
          siblingLimits.top < drawLimits.bottom + margin
        )
          return true;
      }
      break;
    case "s":
      if (
        siblingLimits.top > drawAbsoluteLimits.bottom &&
        siblingLimits.top < drawLimits.bottom + margin
      ) {
        if (
          siblingLimits.left < drawLimits.right + margin &&
          siblingLimits.left > drawLimits.left - margin
        )
          return true;
        if (
          siblingLimits.right > drawLimits.left - margin &&
          siblingLimits.right < drawLimits.right + margin
        )
          return true;
      }
      break;
    case "w":
      if (
        siblingLimits.right < drawAbsoluteLimits.left &&
        siblingLimits.right > drawLimits.left - margin
      ) {
        if (
          siblingLimits.bottom > drawLimits.top - margin &&
          siblingLimits.bottom < drawLimits.bottom + margin
        )
          return true;
        if (
          siblingLimits.top > drawLimits.top - margin &&
          siblingLimits.top < drawLimits.bottom + margin
        )
          return true;
      }
      break;
  }
};
