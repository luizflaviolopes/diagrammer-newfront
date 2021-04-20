import * as types from "../types/drawTypes";

const elementsConnectorPointsCalculator = (type, w, h) => {
  switch (type) {
    // case types.DRAW_CIRCLE:
    //   const big = w > h ? w : h;
    //   return [
    //     { x: big / 2, y: 0, angle: 90, pointref: "a" },
    //     { x: big, y: big / 2, angle: 0, pointref: "b" },
    //     { x: big / 2, y: big, angle: 270, pointref: "c" },
    //     { x: 0, y: big / 2, angle: 180, pointref: "d" }
    //   ];
    case types.DRAW_CIRCLE:
    case types.DRAW_RECTANGLE:
      return [
        { x: w / 2, y: 0, angle: 90, pointref: "a" },
        { x: 0, y: h / 2, angle: 180, pointref: "b" },
        { x: w, y: h / 2, angle: 0, pointref: "c" },
        { x: w / 2, y: h, angle: 270, pointref: "d" },
      ];
    default:
      return [{ x: 0, y: 0, angle: 270, pointref: "a" }];
  }
};

export default elementsConnectorPointsCalculator;
