import * as drawTypes from "../../types/drawTypes";
import { startDragDrawListBoxDraw } from "../drawListBoxResolver";

export const autoResize = (state, parent, positionBoardRelative, padding) => {
  autoResizeParent(state, parent, positionBoardRelative, padding);
};

export const findLimitPointsFromDrawArray = (elementArray) => {
  const firstElement = elementArray[0];

  let childrenLimitPoints = {
    left: firstElement.x,
    top: firstElement.y,
    right: firstElement.x + firstElement.width,
    bottom: firstElement.y + firstElement.heigth,
  };

  for (let z = 1; z < elementArray.length; z++) {
    let elementSelected = elementArray[z];
    if (elementSelected.x < childrenLimitPoints.left)
      childrenLimitPoints.left = elementSelected.x;
    if (elementSelected.y < childrenLimitPoints.top)
      childrenLimitPoints.top = elementSelected.y;
    if (elementSelected.x + elementSelected.width > childrenLimitPoints.right)
      childrenLimitPoints.right = elementSelected.x + elementSelected.width;
    if (elementSelected.y + elementSelected.heigth > childrenLimitPoints.bottom)
      childrenLimitPoints.bottom = elementSelected.y + elementSelected.heigth;
  }

  return childrenLimitPoints;
};

const autoResizeParent = (state, parent, positionBoardRelative, padding) => {
  let selectedsIds = state.sessionState.drawsSelected;

  let selectedDraws = selectedsIds.map((id) => {
    return state.draws[id];
  });

  let childrenLimitPoints = findLimitPointsFromDrawArray(selectedDraws);

  let drawLimitPoints = {
    left: positionBoardRelative.x,
    top: positionBoardRelative.y,
    right: positionBoardRelative.x + parent.width,
    bottom: positionBoardRelative.y + parent.heigth,
  };

  autoResizeDraws(state, parent, padding, childrenLimitPoints, drawLimitPoints);

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
    bottom: parent.y + parent.heigth,
  };

  let drawLimitPoints = {
    left: 0,
    top: 0,
    right: grandParent.width,
    bottom: grandParent.heigth,
  };

  autoResizeDraws(
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
};

const autoResizeDraws = (
  state,
  draw,
  padding,
  childrensLimitPoints,
  drawLimitPoints
) => {
  let variationsFromResize;

  if (draw.type == drawTypes.DRAW_CIRCLE)
    variationsFromResize = resizeCircle(
      draw,
      padding,
      childrensLimitPoints,
      drawLimitPoints
    );
  else if (draw.type == drawTypes.DRAW_RECTANGLE)
    variationsFromResize = resizeRect(
      draw,
      padding,
      childrensLimitPoints,
      drawLimitPoints
    );
  else throw { error: "desenho inválido" };

  repositionChildrens(state, draw, {
    x: variationsFromResize.varX,
    y: variationsFromResize.varY,
  });

  updateConnectorsFromResize(draw, state.connectors, variationsFromResize);

  draw.absolutePosition = {
    x: draw.absolutePosition.x + variationsFromResize.varX,
    y: draw.absolutePosition.y + variationsFromResize.varY,
  };
};

const repositionChildrens = (state, drawUpdated, variationsXY) => {
  //é possível aumentar a performance, separando o calculo para x e y.
  if (variationsXY.x < 0 || variationsXY.y < 0) {
    for (let c = 0; c < drawUpdated.childrens.length; c++) {
      updateChildrensPositionOnParentResize(
        state.draws[drawUpdated.childrens[c]],
        variationsXY
      );
    }
  }
};

const updateParentSizeCircle = (
  state,
  parent,
  absolutePosition,
  paddingFull
) => {
  const padding = paddingFull / 2;
  const radius = Math.max(parent.width, parent.heigth) / 2;

  //console.log("atualizando tamanho");
  let variationX = 0;
  let variationY = 0;
  let variationH = 0;
  let variationW = 0;

  const calcHipotenusa = (pointA, PointB) => {
    const adjacent = Math.abs(pointA.x - PointB.x);
    const oposite = Math.abs(pointA.y - PointB.y);

    return Math.sqrt(adjacent * adjacent + oposite * oposite);
  };

  let selecteds = state.sessionState.drawsSelected;

  const rectToCircleDiagonal = Math.sqrt(2 * (radius * radius)) - radius;
  const rectToCircle = Math.sqrt(
    (rectToCircleDiagonal * rectToCircleDiagonal) / 2
  );

  let pointTopLeft = {
    x: parent.x + rectToCircle,
    y: parent.y + rectToCircle,
  };
  let pointTopRight = {
    x: parent.x + parent.width - rectToCircle,
    y: parent.y + rectToCircle,
  };
  let pointBottomRight = {
    x: parent.x + parent.width - rectToCircle,
    y: parent.y + parent.heigth - rectToCircle,
  };
  let pointBottomLeft = {
    x: parent.x + rectToCircle,
    y: parent.y + parent.heigth - rectToCircle,
  };

  for (let z = 0; z < selecteds.length; z++) {
    const dropped = state.draws[selecteds[z]];

    if (dropped.x + dropped.y < pointTopLeft.x + pointTopLeft.y)
      pointTopLeft = { x: dropped.x, y: dropped.y };

    if (
      (dropped.x + dropped.width) / dropped.y >
      pointTopRight.x / pointTopRight.y
    )
      pointTopRight = { x: dropped.x + dropped.width, y: dropped.y };

    if (
      (dropped.x + dropped.width) * (dropped.y + dropped.heigth) >
      pointBottomRight.x * pointBottomRight.y
    )
      pointBottomRight = {
        x: dropped.x + dropped.width,
        y: dropped.y + dropped.heigth,
      };

    if (
      (dropped.y + dropped.heigth) / dropped.x >
      pointBottomLeft.y / pointBottomLeft.x
    )
      pointBottomLeft = { x: dropped.x, y: dropped.y + dropped.heigth };
  }

  const centerX =
    (pointTopLeft.x +
      pointTopRight.x +
      pointBottomRight.x +
      pointBottomLeft.x) /
    4;
  const centerY =
    (pointTopLeft.y +
      pointTopRight.y +
      pointBottomRight.y +
      pointBottomLeft.y) /
    4;

  const centerPoint = { x: centerX, y: centerY };

  parent.resizePoints = [
    pointTopLeft,
    pointTopRight,
    pointBottomRight,
    pointBottomLeft,
    centerPoint,
  ];

  // const topLine = calcHipotenusa(pointTopLeft,pointTopRight);
  // const rigthLine = calcHipotenusa(pointTopLeft,pointTopRight);

  const distanceToTopLeft = calcHipotenusa(centerPoint, pointTopLeft);
  const distanceToTopRigth = calcHipotenusa(centerPoint, pointTopRight);
  const distanceToBottomRigth = calcHipotenusa(centerPoint, pointBottomRight);
  const distanceToBottomLeft = calcHipotenusa(centerPoint, pointBottomLeft);

  const pointsDistancesToCenter = [
    distanceToTopLeft,
    distanceToTopRigth,
    distanceToBottomRigth,
    distanceToBottomLeft,
  ];

  //pointsDistancesToCenter.push(parent.width / 2);

  const newRadius = Math.max(...pointsDistancesToCenter);

  const newPosition = {
    x: centerPoint.x - newRadius,
    y: centerPoint.y - newRadius,
  };

  variationX = newPosition.x - parent.x;
  variationY = newPosition.y - parent.y;
  variationH = newRadius - parent.heigth;
  variationW = newRadius - parent.width;

  parent.x = newPosition.x;
  parent.y = newPosition.y;
  parent.heigth = newRadius * 2;
  parent.width = newRadius * 2;

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
  let variationX = 0;
  let variationY = 0;
  let variationW = 0;
  let variationH = 0;
  let isUpdated = false;

  //comparando esquerda
  if (childrensLimitPoints.left < drawLimitPoints.left + padding) {
    variationX = childrensLimitPoints.left - (drawLimitPoints.left + padding);

    drawToResize.x = drawToResize.x + variationX;
    drawToResize.width = drawToResize.width - variationX;
    isUpdated = true;
  }

  //comparando topo
  if (childrensLimitPoints.top < drawLimitPoints.top + padding) {
    variationY = childrensLimitPoints.top - (drawLimitPoints.top + padding);

    drawToResize.y = drawToResize.y + variationY;
    drawToResize.heigth = drawToResize.heigth - variationY;
    isUpdated = true;
  }

  //comparando direita
  if (childrensLimitPoints.right > drawLimitPoints.right - padding) {
    //calcular nova largura
    let calcW =
      childrensLimitPoints.right +
      padding -
      (drawLimitPoints.left + variationX);
    //comparar largura anterior e nova
    variationW = calcW - drawToResize.width;
    //definir nova largura
    drawToResize.width = calcW;
    isUpdated = true;
  }

  //comparando baixo
  if (childrensLimitPoints.bottom > drawLimitPoints.bottom - padding) {
    //calcular nova altura
    let calcH =
      childrensLimitPoints.bottom +
      padding -
      (drawLimitPoints.top + variationY);
    //comparar altura anterior e nova
    variationH = calcH - drawToResize.heigth;
    //definir nova altura
    drawToResize.heigth = calcH;
    isUpdated = true;
  }

  const variations = {
    varX: variationX,
    varY: variationY,
    varW: variationW,
    varH: variationH,
    isUpdated,
  };

  return variations;
};

const resizeCircle = (
  drawToResize,
  padding,
  childrensLimitPoints,
  drawLimitPoints
) => {
  const radius = Math.max(drawToResize.width, drawToResize.heigth) / 2;

  const calcHipotenusa = (pointA, PointB) => {
    const adjacent = Math.abs(pointA.x - PointB.x);
    const oposite = Math.abs(pointA.y - PointB.y);

    return Math.sqrt(adjacent * adjacent + oposite * oposite);
  };

  const rectToCircleDiagonal = Math.sqrt(2 * (radius * radius)) - radius;
  const rectToCircle = Math.sqrt(
    (rectToCircleDiagonal * rectToCircleDiagonal) / 2
  );

  let pointTopLeftDraw = {
    x: drawLimitPoints.left + rectToCircle,
    y: drawLimitPoints.top + rectToCircle,
  };
  let pointTopRightDraw = {
    x: drawLimitPoints.right - rectToCircle,
    y: drawLimitPoints.top + rectToCircle,
  };
  let pointBottomRightDraw = {
    x: drawLimitPoints.right - rectToCircle,
    y: drawLimitPoints.bottom - rectToCircle,
  };
  let pointBottomLeftDraw = {
    x: drawLimitPoints.left + rectToCircle,
    y: drawLimitPoints.bottom - rectToCircle,
  };

  let actualCenterPoint = {
    x: (drawLimitPoints.left + drawLimitPoints.right) / 2,
    y: (drawLimitPoints.top + drawLimitPoints.bottom) / 2,
  };

  let pointsToCalc = [
    pointTopLeftDraw,
    pointTopRightDraw,
    pointBottomRightDraw,
    pointBottomLeftDraw,
  ];

  let pointTopLeft = {
    x: childrensLimitPoints.left,
    y: childrensLimitPoints.top,
  };
  let pointTopRight = {
    x: childrensLimitPoints.right,
    y: childrensLimitPoints.top,
  };
  let pointBottomRight = {
    x: childrensLimitPoints.right,
    y: childrensLimitPoints.bottom,
  };
  let pointBottomLeft = {
    x: childrensLimitPoints.left,
    y: childrensLimitPoints.bottom,
  };

  if (calcHipotenusa(actualCenterPoint, pointTopLeft) > radius)
    pointsToCalc.push(pointTopLeft);
  if (calcHipotenusa(actualCenterPoint, pointTopRight) > radius)
    pointsToCalc.push(pointTopRight);
  if (calcHipotenusa(actualCenterPoint, pointBottomRight) > radius)
    pointsToCalc.push(pointBottomRight);
  if (calcHipotenusa(actualCenterPoint, pointBottomLeft) > radius)
    pointsToCalc.push(pointBottomLeft);

  const centerX =
    pointsToCalc.reduce((p, c) => {
      return p + c.x;
    }, 0) / pointsToCalc.length;
  const centerY =
    pointsToCalc.reduce((p, c) => {
      return p + c.y;
    }, 0) / pointsToCalc.length;

  const newCenterPoint = { x: centerX, y: centerY };

  const pointsDistancesToCenter = pointsToCalc.reduce((p, c) => {
    p.push(calcHipotenusa(newCenterPoint, c));
    return p;
  }, []);

  const newRadius = Math.max(...pointsDistancesToCenter);

  const newPosition = {
    x: newCenterPoint.x - newRadius,
    y: newCenterPoint.y - newRadius,
  };

  //drawToResize.resizePoints = [...pointsToCalc, actualCenterPoint];

  let variationX = newPosition.x - drawLimitPoints.left;
  let variationY = newPosition.y - drawLimitPoints.top;
  let variationH = newRadius * 2 - drawToResize.heigth + variationY;
  let variationW = newRadius * 2 - drawToResize.width + variationX;

  drawToResize.x += variationX;
  drawToResize.y += variationY;
  drawToResize.heigth = newRadius * 2;
  drawToResize.width = newRadius * 2;

  const newPositions = {
    x: newPosition.x,
    y: newPosition.y,
    varX: variationX,
    varY: variationY,
    varW: variationW,
    varH: variationH,
  };

  return newPositions;
};

export const manualResize = (state, draw, dragPosition, corner) => {
  // let childrenElements = draw.childrens.map((id) => {
  //   return state.draws[id];
  // });

  // let limitpoints = childrenElements.length > 0 ? findLimitPointsFromDrawArray(childrenElements):

  let limitpoints = draw.limitPoints;

  for (let i = 0; i < corner.length; i++) {
    const side = corner[i];

    switch (side) {
      case "n":
        const variationY = resizeN(draw, dragPosition, limitpoints.top);
        repositionChildrensFromAbsolutePosition(state, draw, variationY);
        break;
      case "e":
        resizeE(draw, dragPosition, limitpoints.right);
        break;
      case "s":
        resizeS(draw, dragPosition, limitpoints.bottom);
        break;
      case "w":
        const variationX = resizeW(draw, dragPosition, limitpoints.left);
        repositionChildrensFromAbsolutePosition(state, draw, variationX);
        break;
    }
  }
};

const resizeN = (draw, position, limit) => {
  let variation = position.y;

  if (variation > limit) variation = limit;

  draw.y = draw.absolutePosition.y + variation;
  draw.heigth = draw.absolutePosition.heigth - variation;

  return { y: variation, x: undefined };
};
const resizeE = (draw, position, limit) => {
  const variation = position.x;
  let newWidth = draw.absolutePosition.width + variation;

  if (newWidth < limit) newWidth = limit;
  draw.width = newWidth;
};
const resizeS = (draw, position, limit) => {
  const variation = position.y;
  let newHeigth = draw.absolutePosition.heigth + variation;

  if (newHeigth < limit) newHeigth = limit;

  draw.heigth = newHeigth;
};
const resizeW = (draw, position, limit) => {
  let variation = position.x;

  if (variation > limit) variation = limit;

  draw.x = draw.absolutePosition.x + variation;
  draw.width = draw.absolutePosition.width - variation;

  return { x: variation, y: undefined };
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

      children.x = children.absolutePosition.x - variation.x;
    }
  if (variation.y != undefined) {
    for (let c = 0; c < drawUpdated.childrens.length; c++) {
      let children = state.draws[drawUpdated.childrens[c]];

      children.y = children.absolutePosition.y - variation.y;
    }
  }
};
