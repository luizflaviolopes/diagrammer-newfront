export const polylinePointsTransformation = (arrayOfPoints) => {
  const points = `M ${arrayOfPoints[0].x},${arrayOfPoints[0].y} 
  c ${arrayOfPoints[1].x},${arrayOfPoints[1].y} ${arrayOfPoints[2].x},${arrayOfPoints[2].y}
  ${arrayOfPoints[3].x},${arrayOfPoints[3].y}
  `;

  return points;
};

export const intermediatePointsCalculator = (from, to, margin) => {
  const middlePoints = middlePointsCalculator(from, from.angle, to, to.angle);

  return [{ x: from.x, y: from.y }, ...middlePoints];
};

export const arrowPointsCalculator = (from, to) => {};

const middlePointsCalculator = (pointA, anglePointA, pointB, anglePointB) => {
  //if connector start and end in same point
  if (pointA.x === pointB.x && pointA.y === pointB.y) {
    const curveBezierRatio = 70;
    switch (anglePointA) {
      case 0:
        return [
          { x: curveBezierRatio, y: -curveBezierRatio },
          { x: curveBezierRatio, y: curveBezierRatio },
          { x: 0, y: 10 },
        ];
      case 90:
        return [
          { x: -curveBezierRatio, y: -curveBezierRatio },
          { x: curveBezierRatio, y: -curveBezierRatio },
          { x: 10, y: 0 },
        ];
      case 180:
        return [
          { x: -curveBezierRatio, y: curveBezierRatio },
          { x: -curveBezierRatio, y: -curveBezierRatio },
          { x: 0, y: -10 },
        ];
      case 270:
        return [
          { x: curveBezierRatio, y: curveBezierRatio },
          { x: -curveBezierRatio, y: curveBezierRatio },
          { x: -10, y: 0 },
        ];
    }
  }

  const margin = 0.5;
  const diff = {
    x: pointB.x - pointA.x,
    y: pointB.y - pointA.y,
  };
  diff.ratio = margin * (Math.abs(diff.y) + Math.abs(diff.x));

  const startBezierPoint = getStartBezierPoint(anglePointA, diff);
  const endBezierPoint = getEndBezierPoint(
    anglePointB !== undefined
      ? anglePointB
      : Math.abs(anglePointA >= 180 ? anglePointA - 180 : anglePointA + 180),
    diff
  );
  const endPoint = { x: diff.x, y: diff.y };

  const points = [startBezierPoint, endBezierPoint, endPoint];

  return points;
};

const getStartBezierPoint = (angle, diff) => {
  switch (angle) {
    case 0:
      return { x: diff.ratio, y: 0 };
    case 90:
      return { x: 0, y: -diff.ratio };
    case 180:
      return { x: -diff.ratio, y: 0 };
    case 270:
      return { x: 0, y: diff.ratio };
  }
};

const getEndBezierPoint = (angle, diff) => {
  switch (angle) {
    case 0:
      return {
        x: diff.x + diff.ratio,
        y: diff.y,
      };
    case 90:
      return {
        x: diff.x,
        y: diff.y - diff.ratio,
      };
    case 180:
      return {
        x: diff.x - diff.ratio,
        y: diff.y,
      };
    case 270:
      return {
        x: diff.x,
        y: diff.y + diff.ratio,
      };
  }
};
