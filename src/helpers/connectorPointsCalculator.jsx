export const polylinePointsTransformation = (arrayOfPoints) => {
  const points = `M ${arrayOfPoints[0].x},${arrayOfPoints[0].y} 
  c ${arrayOfPoints[1].x},${arrayOfPoints[1].y} ${arrayOfPoints[2].x},${arrayOfPoints[2].y}
  ${arrayOfPoints[3].x},${arrayOfPoints[3].y}
  `;
  // const pointsConverted = arrayOfPoints.map((point) => {
  //   return `${point.x},${point.y}`;
  // });

  // return pointsConverted.join(" ");

  return points;
};

export const intermediatePointsCalculator = (from, to, margin) => {
  const marginFromPoint = marginPointCalculator(from.x, from.y, from.angle, 0);
  //const marginToPoint = marginPointCalculator(to.x, to.y, to.angle, 0);

  const middlePoints = middlePointsCalculator(from, from.angle, to, to.angle);

  // return [marginFromPoint, ...middlePoints, marginToPoint];
  return [marginFromPoint, ...middlePoints];
};

export const arrowPointsCalculator = (from, to) => {};

const marginPointCalculator = (x, y, angle, margin) => {
  if (angle == 0) return { x: x + margin, y: y };
  else if (angle == 90) return { x: x, y: y - margin };
  else if (angle == 180) return { x: x - margin, y: y };
  else if (angle == 270) return { x: x, y: y + margin };
  else return { x: x, y: y };
};

const middlePointsCalculator = (pointA, anglePointA, pointB, anglePointB) => {
  const margin = 0.5;
  const diff = {
    x: pointB.x - pointA.x,
    y: pointB.y - pointA.y,
  };
  diff.ratio = margin * (Math.abs(diff.y) + Math.abs(diff.x));
  // const relation = Math.abs(anglePointA - anglePointB);

  // if (relation == 90 || relation == 270) {
  //   if (anglePointA == 90 || anglePointA == 270)
  //     return [{ x: pointA.x, y: pointB.y }, { x: pointA.x, y: pointB.y }];
  //   else return [{ x: pointB.x, y: pointA.y }];
  // } else {
  //   if (anglePointA == 90 || anglePointA == 270) {
  //     const middleY = (pointA.y + pointB.y) / 2;
  //     return [
  //       { x: pointA.x, y: middleY },
  //       { x: pointB.x, y: middleY },
  //     ];
  //   } else {
  //     const middleX = (pointA.x + pointB.x) / 2;
  //     return [
  //       { x: middleX, y: pointA.y },
  //       { x: middleX, y: pointB.y },
  //     ];
  //   }
  // }
  switch (`${anglePointA},${anglePointB}`) {
    case "0,0":
      return [
        { x: diff.ratio, y: 0 },
        {
          x: diff.x + diff.ratio,
          y: diff.y,
        },
        { x: diff.x, y: diff.y },
      ];
    case "0,90":
      return [
        { x: pointA.x, y: pointA.y },
        { x: pointB.x, y: pointB.y },
      ];
    case "0,180":
      return [
        { x: pointA.x, y: pointA.y },
        { x: pointB.x, y: pointB.y },
      ];
    case "0,270":
      return [
        { x: pointA.x, y: pointA.y },
        { x: pointB.x, y: pointB.y },
      ];
    case "90,0":
      return [
        { x: pointA.x, y: pointA.y },
        { x: pointB.x, y: pointB.y },
      ];
    case "90,90":
      return [
        { x: 0, y: -diff.ratio },
        {
          x: diff.x,
          y: diff.y - diff.ratio,
        },
        { x: diff.x, y: diff.y },
      ];
    case "90,180":
      return [
        { x: pointA.x, y: pointA.y },
        { x: pointB.x, y: pointB.y },
      ];
    case "90,270":
      return [
        { x: pointA.x, y: pointA.y },
        { x: pointB.x, y: pointB.y },
      ];
    case "180,0":
      return [
        { x: pointA.x, y: pointA.y },
        { x: pointB.x, y: pointB.y },
      ];
    case "180,90":
      return [
        { x: pointA.x, y: pointA.y },
        { x: pointB.x, y: pointB.y },
      ];
    case "180,180":
      return [
        { x: -diff.ratio, y: 0 },
        {
          x: diff.x - diff.ratio,
          y: diff.y,
        },
        { x: diff.x, y: diff.y },
      ];
    case "180,270":
      return [
        { x: pointA.x, y: pointA.y },
        { x: pointB.x, y: pointB.y },
      ];
    case "270,0":
      return [
        { x: pointA.x, y: pointA.y },
        { x: pointB.x, y: pointB.y },
      ];
    case "270,90":
      return [
        { x: pointA.x, y: pointA.y },
        { x: pointB.x, y: pointB.y },
      ];
    case "270,180":
      return [
        { x: pointA.x, y: pointA.y },
        { x: pointB.x, y: pointB.y },
      ];
    case "270,270":
      return [
        { x: 0, y: diff.ratio },
        {
          x: diff.x,
          y: diff.y + diff.ratio,
        },
        { x: diff.x, y: diff.y },
      ];
    default:
      return [
        { x: margin * (Math.abs(diff.y) + Math.abs(diff.x)), y: 0 },
        {
          x: diff.x + margin * (Math.abs(diff.y) + Math.abs(diff.x)),
          y: diff.y,
        },
        { x: diff.x, y: diff.y },
      ];
  }
};
