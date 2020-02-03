import * as types from "../types/drawTypes";

const elementsConnectorPointsCalculator = (type, w, h, r) => {
  switch (type) {
    case types.DRAW_CIRCLE:
      return [
        { x: 0, y: r, ref: "a" },
        { x: 0, y: -r, ref: "b" },
        { x: r, y: 0, ref: "c" },
        { x: -r, y: 0, ref: "d" }
      ];
    case types.DRAW_RECTANGLE:
      return [
        { x: w / 2, y: 0, ref: "a" },
        { x: 0, y: h / 2, ref: "b" },
        { x: w, y: h / 2, ref: "c" },
        { x: w / 2, y: h, ref: "d" }
      ];
    default:
      return [{ x: 0, y: 0 }];
  }
};

export default elementsConnectorPointsCalculator;
