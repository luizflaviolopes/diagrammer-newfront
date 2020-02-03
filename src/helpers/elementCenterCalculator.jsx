import * as types from "../types/drawTypes";

const elementCenterCalculator = type => {
  return (x, y, w, h) => {
    switch (type) {
      case types.DRAW_CIRCLE:
        return {
          x: x,
          y: y
        };
      default:
        return {
          x: x + w / 2,
          y: y + h / 2
        };
    }
  };
};

export default elementCenterCalculator;
