import * as drawTypes from "../../types/drawTypes";

export const autoResize = (state, parent, positionBoardRelative, padding) => {
  autoResizeParent(state, parent, positionBoardRelative, padding);

  autoResizeGrandParents(state, parent, padding);
};

const autoResizeParent = (state, parent, positionBoardRelative, padding) => {
  let variations;

  if (parent.type == drawTypes.DRAW_CIRCLE)
    variations = updateParentSizeCircle(
      state,
      parent,
      positionBoardRelative,
      padding
    );
  else
    variations = updateParentSizeRect(
      state,
      parent,
      positionBoardRelative,
      padding
    );

  repositionChildrens(state, parent, {
    x: variations.varX,
    y: variations.varY,
  });
};

const autoResizeGrandParents = (state, parent, padding) => {
  if (!parent.parent) return;

  const grandParent = state.draws[parent.parent];

  const limits = {
    left: parent.x,
    top: parent.y,
    right: parent.x + parent.width,
    bottom: parent.y + parent.heigth,
  };

  const variations = calculoDoQuadrado(grandParent, padding, limits);

  //   let variationX = 0;
  //   let variationY = 0;
  //   let variationW = 0;
  //   let variationH = 0;
  //   let isUpdated = false;

  //   if (parent.x < padding) {
  //     variationX = parent.x - padding;

  //     grandParent.x = grandParent.x + variationX;
  //     grandParent.width = grandParent.width - variationX;
  //     isUpdated = true;
  //   }
  //   if (parent.y < padding) {
  //     variationY = parent.y - padding;

  //     grandParent.y = grandParent.y + variationY;
  //     grandParent.heigth = grandParent.heigth - variationY;
  //     isUpdated = true;
  //   }
  //   if (parent.x + parent.width - variationX > grandParent.width - padding) {
  //     let calcW = parent.x + parent.width + padding - variationX;
  //     variationW = calcW - grandParent.width;
  //     grandParent.width = calcW;
  //     isUpdated = true;
  //   }
  //   if (parent.y + parent.heigth - variationY > grandParent.heigth - padding) {
  //     let calcH = parent.y + parent.heigth + padding - variationY;
  //     variationH = calcH - grandParent.heigth;
  //     grandParent.heigth = calcH;
  //     isUpdated = true;
  //   }

  //   const variations = {
  //     varX: variationX,
  //     varY: variationY,
  //     varW: variationW,
  //     varH: variationH,
  //   };

  repositionChildrens(state, grandParent, {
    x: variations.varX,
    y: variations.varY,
  });

  updateConnectorsFromResize(grandParent, state.connectors, variations);

  if (variations.isUpdated) autoResizeGrandParents(state, grandParent, padding);
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

  console.log("atualizando tamanho");
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

const updateParentSizeRect = (state, parent, absolutePosition, padding) => {
  console.log("atualizando tamanho");

  let selecteds = state.sessionState.drawsSelected;
  const firstElement = state.draws[selecteds[0]];

  let limits = {
    left: firstElement.x,
    top: firstElement.y,
    right: firstElement.x + firstElement.width,
    bottom: firstElement.y + firstElement.heigth,
  };

  for (let z = 1; z < selecteds.length; z++) {
    let elementSelected = state.draws[selecteds[z]];
    if (elementSelected.x < limits.left) limits.left = elementSelected.x;
    if (elementSelected.y < limits.top) limits.top = elementSelected.y;
    if (elementSelected.x + elementSelected.width > limits.right)
      limits.right = elementSelected.x + elementSelected.width;
    if (elementSelected.y + elementSelected.heigth > limits.bottom)
      limits.bottom = elementSelected.y + elementSelected.heigth;
  }

  const newPositions = calculoDoQuadrado(
    parent,
    padding,
    limits,
    absolutePosition
  );

  //   let variationX = 0;
  //   let variationY = 0;
  //   let variationH = 0;
  //   let variationW = 0;

  //   if (minX < absolutePosition.x + padding) {
  //     variationX = minX - (absolutePosition.x + padding);

  //     parent.x = parent.x + variationX;
  //     parent.width = parent.width - variationX;
  //   }
  //   if (minY < absolutePosition.y + padding) {
  //     variationY = minY - (absolutePosition.y + padding);

  //     parent.y = parent.y + variationY;
  //     parent.heigth = parent.heigth - variationY;
  //   }
  //   if (maxRight > absolutePosition.x + variationX + parent.width - padding) {
  //     variationW =
  //       maxRight + padding - (absolutePosition.x + variationX + parent.width);
  //     parent.width = parent.width + variationW;
  //   }
  //   if (maxBottom > absolutePosition.y + variationY + parent.heigth - padding) {
  //     variationH =
  //       maxBottom + padding - (absolutePosition.y + variationY + parent.heigth);
  //     parent.heigth = parent.heigth + variationH;
  //   }

  //   const newPositions = {
  //     x: absolutePosition.x + variationX,
  //     y: absolutePosition.y + variationY,
  //     varX: variationX,
  //     varY: variationY,
  //     varW: variationW,
  //     varH: variationH,
  //   };

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

const calculoDoQuadrado = (
  drawToResize,
  padding,
  limitPoints,
  absolutePosition = { x: 0, y: 0 }
) => {
  let variationX = 0;
  let variationY = 0;
  let variationW = 0;
  let variationH = 0;
  let isUpdated = false;

  if (limitPoints.left < absolutePosition.x + padding) {
    variationX = limitPoints.left - (absolutePosition.x + padding);

    drawToResize.x = drawToResize.x + variationX;
    drawToResize.width = drawToResize.width - variationX;
    isUpdated = true;
  }
  if (limitPoints.top < absolutePosition.y + padding) {
    variationY = limitPoints.top - (absolutePosition.y + padding);

    drawToResize.y = drawToResize.y + variationY;
    drawToResize.heigth = drawToResize.heigth - variationY;
    isUpdated = true;
  }
  if (
    limitPoints.right - variationX >
    absolutePosition.x + drawToResize.width - padding
  ) {
    let calcW = limitPoints.right + padding - (absolutePosition.x + variationX);
    variationW = calcW - drawToResize.width;
    drawToResize.width = calcW;
    isUpdated = true;
  }
  if (limitPoints.bottom - variationY > drawToResize.heigth - padding) {
    let calcH =
      limitPoints.bottom + padding - (absolutePosition.y + variationY);
    variationH = calcH - drawToResize.heigth;
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
