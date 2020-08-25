import * as types from "../types/drawTypes";

const elementsConnectorPointsCalculator = (type, w, h) => {
  switch (type) {
    // case types.DRAW_CIRCLE:
    //   const big = w > h ? w : h;
    //   return [
    //     { x: big / 2, y: 0, angle: 90, pointRef: "a" },
    //     { x: big, y: big / 2, angle: 0, pointRef: "b" },
    //     { x: big / 2, y: big, angle: 270, pointRef: "c" },
    //     { x: 0, y: big / 2, angle: 180, pointRef: "d" }
    //   ];
    case types.DRAW_CIRCLE:
    case types.DRAW_RECTANGLE:
      return [
        { x: w / 2, y: 0, angle: 90, pointRef: "a" },
        { x: 0, y: h / 2, angle: 180, pointRef: "b" },
        { x: w, y: h / 2, angle: 0, pointRef: "c" },
        { x: w / 2, y: h, angle: 270, pointRef: "d" },
      ];
    default:
      return [{ x: 0, y: 0, angle: 270, pointRef: "a" }];
  }
};

export default elementsConnectorPointsCalculator;
