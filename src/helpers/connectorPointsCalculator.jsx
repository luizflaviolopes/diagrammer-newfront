export const polylinePointsTransformation = arrayOfPoints => {
  const pointsConverted = arrayOfPoints.map(point => {
    return `${point.x},${point.y}`;
  });

  return pointsConverted.join(" ");
};

export const intermediatePointsCalculator = (from, to, margin) => {
  const marginFromPoint = marginPointCalculator(from.x, from.y, from.angle, 0);
  const marginToPoint = marginPointCalculator(to.x, to.y, to.angle, margin);

  const middlePoints = middlePointsCalculator(from, from.angle, to, to.angle);

  // return [marginFromPoint, ...middlePoints, marginToPoint];
  return [marginFromPoint, ...middlePoints, marginToPoint];
};

export const arrowPointsCalculator = (from, to) => {};

const marginPointCalculator = (x, y, angle, margin) => {
  if (angle == 0) return { x: x + margin, y: y };
  else if (angle == 90) return { x: x, y: y - margin };
  else if (angle == 180) return { x: x - margin, y: y };
  else if (angle == 270) return { x: x, y: y + margin };
};

const middlePointsCalculator = (pointA, anglePointA, pointB, anglePointB) => {
  const relation = Math.abs(anglePointA - anglePointB);

  if (relation == 90 || relation == 270) {
    if (anglePointA == 90 || anglePointA == 270)
      return [{ x: pointA.x, y: pointB.y }];
    else return [{ x: pointB.x, y: pointA.y }];
  } else {
    if (anglePointA == 90 || anglePointA == 270) {
      const middleY = (pointA.y + pointB.y) / 2;
      return [
        { x: pointA.x, y: middleY },
        { x: pointB.x, y: middleY }
      ];
    } else {
      const middleX = (pointA.x + pointB.x) / 2;
      return [
        { x: middleX, y: pointA.y },
        { x: middleX, y: pointB.y }
      ];
    }
  }
};
